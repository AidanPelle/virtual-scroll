import { ViewContainerRef } from "@angular/core";
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
    ) {
        this._viewContainer = viewContainer;
        this._cellPadding = cellPadding;
        this._mappedActiveColumns$ = mappedActiveColumns$;
        this._moveItem = moveItem;

        this.toggleColumns$.pipe(takeUntil(this._onDestroy)).subscribe();
        this.moveColumn$.pipe(takeUntil(this._onDestroy)).subscribe();
    }

    private _viewContainer!: ViewContainerRef;
    private _cellPadding!: number;
    private _mappedActiveColumns$!: typeof VirtualScrollComponent.prototype.mappedActiveColumns$;
    private _moveItem!: typeof VirtualScrollComponent.prototype.moveItem;
    // private _canReorder = true;
    // private _canResize = true;
    // private _canSelect = true;
    private _onDestroy = new Subject<void>();

    /**
     * Cells that have been turned off, we cache the view so we can restore it after without having to rebuild it
     */
    private _cachedCellViews: CellView[] = [];


    /**
     * Handles keeping track of the first time we fire on rendering a row. Whenever the columns are re-ordered, we do not want to listen to the next active state,
     * except for when we're initially loading. Afterwards, we can safely ignore.
     */
    private _initialLoad = true;

    private toggleColumns$ = defer(() => of(null)).pipe(
        switchMap(() => {
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
            if (val.isActive) {
                const cachedCell = this._cachedCellViews.find(c => c.columnName == val.cellDef.columnName);
                if (cachedCell) {
                    this._viewContainer.insert(cachedCell.viewRef, activeIndex);
                    const i = this._cachedCellViews.indexOf(cachedCell);
                    this._cachedCellViews.splice(i, 1);
                }
                else {
                    const cellView = this._viewContainer.createEmbeddedView(val.cellDef.template, {}, {index: activeIndex});
                    UtilityService.applyCellStyling(val.cellDef, cellView, this._cellPadding);
                }
            } else {
                const cachedCell = this._viewContainer.detach(activeIndex);
                if (cachedCell)
                    this._cachedCellViews.push({columnName: val.cellDef.columnName, viewRef: cachedCell});
            }
        }),
    );

    private moveColumn$ = defer(() => of(null)).pipe(
        switchMap(() => this._moveItem),
        filter(val => val != null),
        switchMap(val => combineLatest([this.activeIndexObs(val.fromIndex), this.activeIndexObs(val.toIndex)])),
        tap(([fromActiveIndex, toActiveIndex]) => {
            const viewToMove = this._viewContainer.get(fromActiveIndex);
            if (viewToMove)
                this._viewContainer.move(viewToMove, toActiveIndex);
        }),
    );

    private activeIndexObs(baseIndex: number) {
       return this._mappedActiveColumns$.pipe(
            switchMap(obsList => {
                return combineLatest(obsList).pipe(
                    map(list => list.slice(0, baseIndex)),
                    map(list => list.filter(isActive => isActive).length),
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