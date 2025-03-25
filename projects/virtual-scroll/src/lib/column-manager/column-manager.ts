import { ViewContainerRef } from "@angular/core";
import { CellDefDirective } from "../defs/cell-def.directive";
import { UtilityService } from "../utility.service";
import { combineLatest, combineLatestWith, defer, map, merge, of, Subject, switchMap, takeUntil, tap } from "rxjs";
import { CellView } from "../interfaces/cell-view";
import { VirtualScrollComponent } from "../virtual-scroll/virtual-scroll.component";

export class ColumnManager<T> {
    constructor(
        cellDefs: CellDefDirective[],
        viewContainer: ViewContainerRef,
        cellPadding: number,
        virtualScroll: VirtualScrollComponent<T>,
    ) {
        this._cellDefs = cellDefs;
        this._viewContainer = viewContainer;
        this._cellPadding = cellPadding;
        this._virtualScroll = virtualScroll;

        this.toggleColumns$.pipe(takeUntil(this._onDestroy)).subscribe();
    }

    private _cellDefs: CellDefDirective[] = [];
    private _viewContainer!: ViewContainerRef;
    private _cellPadding!: number;
    private _virtualScroll!: VirtualScrollComponent<T>;
    // private _canReorder = true;
    // private _canResize = true;
    // private _canSelect = true;
    private _onDestroy = new Subject<void>();

    /**
     * Cells that have been turned off, we cache the view so we can restore it after without having to rebuild it
     */
    private _cachedCellViews: CellView[] = [];

    private toggleColumns$ = defer(() => of(null)).pipe(
        switchMap(() => this._virtualScroll.mappedActiveColumns$.pipe(switchMap(cols => merge(...cols)))),
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
    )

    private activeIndexObs(baseIndex: number) {
        const obsList = this._cellDefs.map(cd => cd.activeState$);
        return combineLatest(obsList).pipe(
            map(list => list.slice(0, baseIndex)),
            map(list => list.filter(isActive => isActive).length),
        );
    }

    onDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
}