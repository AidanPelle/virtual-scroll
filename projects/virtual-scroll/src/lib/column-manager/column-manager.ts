import {
    BehaviorSubject,
    combineLatest,
    defer,
    filter,
    map,
    merge,
    of,
    skip,
    Subject,
    switchMap,
    take,
    takeUntil,
    tap
} from "rxjs";
import { EmbeddedViewRef, TemplateRef, ViewContainerRef } from "@angular/core";
import { UtilityService } from "../utility.service";
import type { VirtualScrollComponent } from "../virtual-scroll/virtual-scroll.component";
import type { CellDefDirective } from "../defs/cell-def.directive";
import type { HeaderCellDefDirective } from "../defs/header-cell-def.directive";
import { CellContext } from "../interfaces/cell-context";

export class ColumnManager<T> {
    /** Cells that are currently active, we cache so that we know which we need to turn off or not. */
    public renderedCellViews: { columnName: string, isSticky: boolean, view: EmbeddedViewRef<unknown> }[] = [];

    /** A reference to the containing virtual scroll component, in order to access internal observables. */
    private _virtualScroll!: typeof VirtualScrollComponent.prototype;

    /** A reference to the view container in which we'll be rendering cells. */
    private readonly _viewContainer!: ViewContainerRef;

    /** A reference to the context of this given row, the data that will be used in each cell. */
    private readonly _item!: T;

    /** The index of the row being rendered, in reference to its position in the parent list. */
    private readonly _index!: number;

    /** A BehaviorSubject that emits whenever the sticky cell in this row is rendered or moved. */
    private readonly _renderSticky: BehaviorSubject<EmbeddedViewRef<CellContext<T>> | null>;

    /** A check for if this column manager is managing the header row, rather than in the raw list (we'll need to render different cell templates). */
    private readonly _isHeader: boolean = false;

    /** The definitions for the header cells. */
    private readonly _headerCellDefs!: HeaderCellDefDirective[];

    /** A default header cell template, to use whenever there is no custom header cell def provided by the user. */
    private readonly _defaultHeaderCellTemplate?: TemplateRef<unknown>;

    /** The slider template, for rendering in between each row. */
    private readonly _sliderTemplate!: TemplateRef<unknown>;

    /** Handles killing open observables whenever this column manager is destroyed. */
    private readonly _onDestroy = new Subject<void>();
    
    /**
     * Handles keeping track of the first time we fire on rendering a row. Whenever the columns are re-ordered, we do not want to listen to the next active state,
     * except for when we're initially loading. Afterwards, we can safely ignore.
     */
    private _initialLoad = true;

    constructor(
        viewContainer: ViewContainerRef,
        virtualScroll: typeof VirtualScrollComponent.prototype,
        item: T,
        index: number,
        renderSticky: BehaviorSubject<EmbeddedViewRef<CellContext<T>> | null>,
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

        this._toggleColumns$.pipe(takeUntil(this._onDestroy)).subscribe();
        this._moveColumn$.pipe(takeUntil(this._onDestroy)).subscribe();
        this._removeCellWidth$.pipe(takeUntil(this._onDestroy)).subscribe();
        this._applyFixedWidth$.pipe(takeUntil(this._onDestroy)).subscribe();
    }

    /**
     * Handles events from the active status of cell defs changing, into turning on/off the relevant column and possibly caching the view.
     */
    private readonly _toggleColumns$ = defer(() => of(null)).pipe(
        // We defer so that the reference to _virtualScroll was instantiated in the constructor by the time this is subscribed to
        switchMap(() => {
            // Whenever the ordering of columns changes, we skip the first output of the active status, so that we don't try to double render columns
            // However, we do not want to skip the first output on the initial load of the row, since that's what initially renders the columns
            return this._virtualScroll.mappedActiveColumns$.pipe(switchMap(cols => {
                const c = cols.map(col => col.pipe(c => c.pipe(skip(this._initialLoad ? 0 : 1))));
                this._initialLoad = false;
                return merge(...c);
            }));
        }),
        switchMap(val => {
            return combineLatest([of(val), this._activeIndexObs(val.baseIndex)]);
        }),
        tap(([val, activeIndex]) => {
            if (val.isActive)
                this._renderCell(val, activeIndex);
            else
                this._removeRenderedCell(val, activeIndex);
            this._updateCellIndices();
        }),
    );

    /** Handles removing the min, max, flex widths of a cell given its name. */
    private readonly _removeCellWidth$ = defer(() => of(null)).pipe( 
        // We defer so that the reference to _virtualScroll was instantiated in the constructor by the time this is subscribed to
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

    /** Handles applying the static column width to a given column, for when we're resizing. */
    private readonly _applyFixedWidth$ = defer(() => of(null)).pipe(
        // We defer so that the reference to _virtualScroll was instantiated in the constructor by the time this is subscribed to
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

    /**
     * Handles moving the column that's been rearranged from its current position in the page, to a new position.
     * 
     * We want to skip when the column is currently not active, and when the ordering of the active items don't change,
     * since this functionality only pertains to physically moving the rendered column.
     */
    private readonly _moveColumn$ = defer(() => of(null)).pipe(
        // We defer so that the reference to _virtualScroll was instantiated in the constructor by the time this is subscribed to
        switchMap(() => this._virtualScroll.moveColumn),
        filter(val => val != null && val.isActive), // We want to skip any null moveItems (initial load), and when the item being moved is inactive since the rendering won't change anyways
        switchMap(val => combineLatest([this._activeIndexObs(val!.fromIndex), this._activeIndexObs(val!.toIndex)])),  // Since we're already filtering null vals, we can assert not null here for compilation
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

            this._updateCellIndices();

            // We re-fire the render sticky in case the sticky cell was moved in the row by these actions (assuming the sticky column is currently rendered)
            if (this.renderedCellViews.find(c => c.isSticky) != null)
                this._renderSticky.next(this._renderSticky.value);
        }),
    );

    onDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    /** Given a cell def directive, render the template inside of the row at the appropriate index, and apply the sticky shadow. */
    private _renderCell(val: { cellDef: CellDefDirective, baseIndex: number, isActive: boolean }, activeIndex: number): void {
        const indexToPlace = this._virtualScroll.canResize ? activeIndex * 2 : activeIndex;
        const cellTemplate = this._isHeader ? (this._headerCellDefs.find(h => h.columnName === val.cellDef.columnName)?.template ?? this._defaultHeaderCellTemplate!) : val.cellDef.template;

        const renderedCell = this._viewContainer.createEmbeddedView(cellTemplate, { $implicit: this._item, index: this._index, columnName: val.cellDef.columnName, cellIndex: activeIndex }, { index: indexToPlace });
        UtilityService.applyCellStyling(val.cellDef, renderedCell.rootNodes[0], this._virtualScroll.cellPadding);
        this.renderedCellViews.push({columnName: val.cellDef.columnName, isSticky: val.cellDef.isSticky, view: renderedCell});

        if (val.cellDef.isSticky) {
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

    /** Given a cell def directive, remove it from the rendered row. */
    private _removeRenderedCell(val: { cellDef: CellDefDirective, baseIndex: number, isActive: boolean }, activeIndex: number): void {
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
     * Given the index of a cell def in the base list, we need to retrieve what it's "active index" is,
     * to tell where to place the generated view in the rendered row.
     */
    private _activeIndexObs(baseIndex: number) {
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
    
    /** Update the implicit context for a cell's index in the row, in case people need to reference how far along the row they are. */
    private _updateCellIndices(): void {
        for (let i = 0; i < this._viewContainer.length; i++) {
            const viewRef = this._viewContainer.get(i) as EmbeddedViewRef<CellContext<T>>;
            viewRef.context.cellIndex = this._virtualScroll.canResize ? Math.floor(i / 2) : i;
        }
    }
}