import { EmbeddedViewRef, ViewContainerRef, ViewRef } from "@angular/core";
import { UtilityService } from "../utility.service";
import { combineLatest, defer, filter, map, merge, of, skip, Subject, switchMap, take, takeUntil, tap } from "rxjs";
import { CellView } from "../interfaces/cell-view";
import type { VirtualScrollComponent } from "../virtual-scroll/virtual-scroll.component";

export class ColumnManager<T> {
    constructor(
        viewContainer: ViewContainerRef,
        cellPadding: number,
        mappedActiveColumns$: typeof VirtualScrollComponent.prototype.mappedActiveColumns$,
        moveItem: typeof VirtualScrollComponent.prototype.moveItem,
        item: T,
        index: number,
    ) {
        this._viewContainer = viewContainer;
        this._cellPadding = cellPadding;
        this._mappedActiveColumns$ = mappedActiveColumns$;
        this._moveItem = moveItem;
        this._item = item;
        this._index = index;

        this.toggleColumns$.pipe(takeUntil(this._onDestroy)).subscribe();
        this.moveColumn$.pipe(takeUntil(this._onDestroy)).subscribe();
    }

    public stickyCell: EmbeddedViewRef<any> | null = null;

    private _viewContainer!: ViewContainerRef;
    private _cellPadding!: number;
    private _mappedActiveColumns$!: typeof VirtualScrollComponent.prototype.mappedActiveColumns$;
    private _moveItem!: typeof VirtualScrollComponent.prototype.moveItem;
    private _item!: T;
    private _index!: number;
    // private _canReorder = true;
    // private _canResize = true;
    // private _canSelect = true;
    private _onDestroy = new Subject<void>();

    /**
     * Cells that are currently active, we cache so that we know which we need to turn off or not
     */
    private _renderedCellViews: string[] = [];


    /**
     * Handles keeping track of the first time we fire on rendering a row. Whenever the columns are re-ordered, we do not want to listen to the next active state,
     * except for when we're initially loading. Afterwards, we can safely ignore.
     */
    private _initialLoad = true;


    /**
     * Handles events from the active status of cell defs changing, into turning on/off the relevant column and possibly caching the view.
     */
    private toggleColumns$ = defer(() => of(null)).pipe(
        switchMap(() => {
            // Whenever the ordering of columns changes, we skip the first output of the active status, so that we don't try to double render columns
            // However, we do not want to skip the first output on the initial load of the row, since that's what initially renders the columns
            return this._mappedActiveColumns$.pipe(switchMap(cols => {
                let c = cols.map(col => col.pipe(c => c.pipe(skip(this._initialLoad ? 0 : 1))));
                this._initialLoad = false;
                return merge(...c);
            }));
        }),
        switchMap(val => {
            return combineLatest([of(val), this.activeIndexObs(val.baseIndex)]);
        }),
        tap(([val, activeIndex]) => {
            if (!val.isActive) {
                const renderedCellIndex = this._renderedCellViews.indexOf(val.cellDef.columnName)
                if (renderedCellIndex === -1)      // If the cell hasn't already been rendered, we can end here, since no action needed.
                    return;
                
                this._viewContainer.remove(activeIndex);
                this._renderedCellViews.splice(renderedCellIndex, 1);
            }
            else {
                const renderedCell = this._viewContainer.createEmbeddedView(val.cellDef.template, {$implicit: this._item, index: this._index}, {index: activeIndex});
                UtilityService.applyCellStyling(val.cellDef, renderedCell as EmbeddedViewRef<any>, this._cellPadding);
                this._renderedCellViews.push(val.cellDef.columnName);

                if (val.cellDef.sticky)
                    this.stickyCell = renderedCell;
            }
        }),
    );


    /**
     * Handles moving the column that's been rearranged from its current position in the page, to a new position.
     * 
     * We want to skip when the column is currently not active, and when the ordering of the active items don't change,
     * since this functionality only pertains to physically moving the rendered column.
     */
    private moveColumn$ = defer(() => of(null)).pipe(
        switchMap(() => this._moveItem),
        filter(val => val != null && val.isActive), // We want to skip any null moveItems (initial load), and when the item being moved is inactive since the rendering won't change anyways
        switchMap(val => combineLatest([this.activeIndexObs(val!.fromIndex), this.activeIndexObs(val!.toIndex)])),  // Since we're already filtering null vals, we can assert not null here for compilation
        tap(([fromActiveIndex, toActiveIndex]) => {
            if (fromActiveIndex === toActiveIndex)
                return;
            
            const viewToMove = this._viewContainer.get(fromActiveIndex);
            if (viewToMove)
                this._viewContainer.move(viewToMove, toActiveIndex);
        }),
    );

    /**
     * Given the index of a cell def in the base list, we need to retrieve what it's "active index" is,
     * to tell where to place the generated view in the rendered row.
     */
    private activeIndexObs(baseIndex: number) {
       return this._mappedActiveColumns$.pipe(
            switchMap(obsList => {
                return combineLatest(obsList).pipe(
                    map(list => list.slice(0, baseIndex)),
                    map(list => list.filter(item => item.isActive).length),
                );
            }),
            take(1),
        );
    }

    onDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
}