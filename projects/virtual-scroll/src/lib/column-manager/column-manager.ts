import { EmbeddedViewRef, TemplateRef, ViewContainerRef } from "@angular/core";
import { UtilityService } from "../utility.service";
import { BehaviorSubject, combineLatest, defer, filter, map, merge, of, skip, Subject, switchMap, take, takeUntil, tap } from "rxjs";
import type { VirtualScrollComponent } from "../virtual-scroll/virtual-scroll.component";
import type { CellDefDirective } from "../defs/cell-def.directive";
import type { HeaderCellDefDirective } from "../defs/header-cell-def.directive";

export class ColumnManager<T> {
    constructor(
        viewContainer: ViewContainerRef,
        virtualScroll: typeof VirtualScrollComponent.prototype,
        item: T,
        index: number,
        renderSticky: BehaviorSubject<EmbeddedViewRef<any> | null>,
        sliderTemplate: TemplateRef<unknown>,
        isHeader: boolean,
        headerCellDefs: HeaderCellDefDirective[],
        defaultHeaderCellTemplate?: TemplateRef<unknown>,
    ) {
        this._viewContainer = viewContainer;
        this._virtualScroll = virtualScroll;
        this._item = item;
        this._index = index;
        this._renderSticky = renderSticky;
        this._isHeader = isHeader;
        this._headerCellDefs = headerCellDefs;
        this._defaultHeaderCellTemplate = defaultHeaderCellTemplate;
        this._sliderTemplate = sliderTemplate;

        this.toggleColumns$.pipe(takeUntil(this._onDestroy)).subscribe();
        this.moveColumn$.pipe(takeUntil(this._onDestroy)).subscribe();
        this.removeCellWidth$.pipe(takeUntil(this._onDestroy)).subscribe();
        this.applyFixedWidth$.pipe(takeUntil(this._onDestroy)).subscribe();
    }

    private _virtualScroll!: typeof VirtualScrollComponent.prototype;
    private _viewContainer!: ViewContainerRef;
    private _item!: T;
    private _index!: number;
    private _renderSticky: BehaviorSubject<EmbeddedViewRef<any> | null>;
    private _isHeader = false;
    private _headerCellDefs!: HeaderCellDefDirective[];
    private _defaultHeaderCellTemplate?: TemplateRef<unknown>;
    private _sliderTemplate!: TemplateRef<unknown>;
    private _onDestroy = new Subject<void>();

    /**
     * Cells that are currently active, we cache so that we know which we need to turn off or not
     */
    public renderedCellViews: { columnName: string, isSticky: boolean, view: EmbeddedViewRef<any> }[] = [];


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
            return this._virtualScroll.mappedActiveColumns$.pipe(switchMap(cols => {
                let c = cols.map(col => col.pipe(c => c.pipe(skip(this._initialLoad ? 0 : 1))));
                this._initialLoad = false;
                return merge(...c);
            }));
        }),
        switchMap(val => {
            return combineLatest([of(val), this.activeIndexObs(val.baseIndex)]);
        }),
        tap(([val, activeIndex]) => {
            if (val.isActive)
                this.renderCell(val, activeIndex);
            else
                this.removeRenderedCell(val, activeIndex);
            this.updateCellIndices();
        }),
    );

    private removeCellWidth$ = defer(() => of(null)).pipe(
        switchMap(() => this._virtualScroll.removeCellWidths),
        tap(columnName => {
            const renderedCell = this.renderedCellViews.find(r => r.columnName === columnName);
            if (!renderedCell) {
                console.error("Rendered cell not found!");
                return;
            }
            UtilityService.removeCellWidths(renderedCell.view.rootNodes[0]);
        }),
    );

    private applyFixedWidth$ = defer(() => of(null)).pipe(
        switchMap(() => this._virtualScroll.applyFixedWidth),
        tap(([columnName, fixedWidth]) => {
            const renderedCell = this.renderedCellViews.find(r => r.columnName === columnName);
            if (!renderedCell) {
                console.error("Rendered cell not found!");
                return;
            }
            UtilityService.applyFixedWidth(renderedCell.view.rootNodes[0], fixedWidth);
        }),
    );

    private renderCell(val: { cellDef: CellDefDirective, baseIndex: number, isActive: boolean }, activeIndex: number): void {
        const indexToPlace = this._virtualScroll.canResize ? activeIndex * 2 : activeIndex;
        const cellTemplate = this._isHeader ? (this._headerCellDefs.find(h => h.columnName === val.cellDef.columnName)?.template ?? this._defaultHeaderCellTemplate!) : val.cellDef.template;

        const renderedCell = this._viewContainer.createEmbeddedView(cellTemplate, { $implicit: this._item, index: this._index, columnName: val.cellDef.columnName, cellIndex: activeIndex }, { index: indexToPlace });
        UtilityService.applyCellStyling(val.cellDef, renderedCell as EmbeddedViewRef<any>, this._virtualScroll.cellPadding);
        this.renderedCellViews.push({columnName: val.cellDef.columnName, isSticky: val.cellDef.sticky, view: renderedCell});

        if (val.cellDef.sticky) {
            renderedCell.rootNodes[0].classList.add('sticky');
            this._renderSticky.next(renderedCell);
            this._virtualScroll.applyStickyShadow$.pipe(takeUntil(this._onDestroy)).subscribe(shadow => {
                renderedCell.rootNodes[0].classList.toggle('sticky-right-shadow', shadow === 'sticky-right-shadow');
                renderedCell.rootNodes[0].classList.toggle('sticky-left-shadow', shadow === 'sticky-left-shadow');
            });
        }

        if (this._virtualScroll.canResize)
            this._viewContainer.createEmbeddedView(this._sliderTemplate, { columnName: val.cellDef.columnName }, { index: indexToPlace + 1 });
    }

    private removeRenderedCell(val: { cellDef: CellDefDirective, baseIndex: number, isActive: boolean }, activeIndex: number): void {
        const renderedCellIndex = this.renderedCellViews.findIndex(r => r.columnName === val.cellDef.columnName);
        const indexToPlace = this._virtualScroll.canResize ? activeIndex * 2 : activeIndex;
        if (renderedCellIndex === -1)      // If the cell hasn't already been rendered, we can end here, since no action needed.
            return;

        this._viewContainer.remove(indexToPlace);
        this.renderedCellViews.splice(renderedCellIndex, 1);

        if (this._virtualScroll.canResize)
            this._viewContainer.remove(indexToPlace);
    }


    /**
     * Handles moving the column that's been rearranged from its current position in the page, to a new position.
     * 
     * We want to skip when the column is currently not active, and when the ordering of the active items don't change,
     * since this functionality only pertains to physically moving the rendered column.
     */
    private moveColumn$ = defer(() => of(null)).pipe(
        switchMap(() => this._virtualScroll.moveItem),
        filter(val => val != null && val.isActive), // We want to skip any null moveItems (initial load), and when the item being moved is inactive since the rendering won't change anyways
        switchMap(val => combineLatest([this.activeIndexObs(val!.fromIndex), this.activeIndexObs(val!.toIndex)])),  // Since we're already filtering null vals, we can assert not null here for compilation
        map(([fromActiveIndex, toActiveIndex]) => this._virtualScroll.canResize ? [fromActiveIndex * 2, toActiveIndex * 2] : [fromActiveIndex, toActiveIndex]),
        tap(([fromActiveIndex, toActiveIndex]) => {
            if (fromActiveIndex === toActiveIndex)
                return;

            const viewToMove = this._viewContainer.get(fromActiveIndex);
            if (!viewToMove)
                return;

            if (this._virtualScroll.canResize) {
                const sliderToMove = this._viewContainer.get(fromActiveIndex + 1);
                if (!sliderToMove)
                    return;

                if (toActiveIndex > fromActiveIndex) {
                    this._viewContainer.move(viewToMove, toActiveIndex + 1);
                    this._viewContainer.move(sliderToMove, toActiveIndex + 1);
                } else {
                    this._viewContainer.move(sliderToMove, toActiveIndex);
                    this._viewContainer.move(viewToMove, toActiveIndex);
                }
            }
            else
                this._viewContainer.move(viewToMove, toActiveIndex);

            this.updateCellIndices();

            // We re-fire the render sticky in case the sticky cell was moved in the row by these actions (assuming the sticky column is currently rendered)
            if (this.renderedCellViews.find(c => c.isSticky) != null)
                this._renderSticky.next(this._renderSticky.value);
        }),
    );

    /**
     * Given the index of a cell def in the base list, we need to retrieve what it's "active index" is,
     * to tell where to place the generated view in the rendered row.
     */
    private activeIndexObs(baseIndex: number) {
        return this._virtualScroll.mappedActiveColumns$.pipe(
            switchMap(obsList => {
                return combineLatest(obsList).pipe(
                    map(list => list.slice(0, baseIndex)),
                    map(list => list.filter(item => item.isActive).length),
                );
            }),
            take(1),
        );
    }
    
    private updateCellIndices(): void {
        for (let i = 0; i < this._viewContainer.length; i++) {
            const viewRef = this._viewContainer.get(i) as EmbeddedViewRef<any>;
            viewRef.context.cellIndex = this._virtualScroll.canResize ? Math.floor(i / 2) : i;
        }
    }

    onDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
}