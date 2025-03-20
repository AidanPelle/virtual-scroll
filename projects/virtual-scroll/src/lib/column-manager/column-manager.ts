import { ViewContainerRef } from "@angular/core";
import { CellDefDirective } from "../defs/cell-def.directive";
import { UtilityService } from "../utility.service";
import { combineLatest, defer, map, merge, of, Subject, switchMap, takeUntil, tap } from "rxjs";
import { CellView } from "../interfaces/cell-view";

export class ColumnManager {
    constructor(
        cellDefs: CellDefDirective[],
        viewContainer: ViewContainerRef,
        cellPadding: number,
    ) {
        this._cellDefs = cellDefs;
        this._viewContainer = viewContainer;
        this._cellPadding = cellPadding;

        this.t2.pipe(takeUntil(this._onDestroy)).subscribe();
    }

    private _cellDefs: CellDefDirective[] = [];
    private _viewContainer!: ViewContainerRef;
    private _cellPadding!: number;
    // private _canReorder = true;
    // private _canResize = true;
    // private _canSelect = true;
    private _onDestroy = new Subject<void>();

    /**
     * Cells that have been turned off, we cache the view so we can restore it after without having to rebuild it
     */
    private _cachedCellViews: CellView[] = [];


    
    private t1 = defer(() => of(null));
    private t2 = this.t1.pipe(
        switchMap(() => {
            const obsList = this._cellDefs.map((cd, baseIndex) => {
                return cd.activeState$.pipe(map(val => {
                    return {def: cd, baseIndex: baseIndex, isActive: val}
                }));
            });
            return merge(...obsList);
        }),
        switchMap(val => {
            const cellsThatOccurBeforeCurrentCell = this._cellDefs.slice(0, val.baseIndex);
            if (cellsThatOccurBeforeCurrentCell.length == 0)
                return val.def.activeState$.pipe(map(a => {
                    return {cellDef: val.def, index: 0, isActive: a};
                }));
            const active$ = cellsThatOccurBeforeCurrentCell.map(c => c.activeState$.pipe(map(state => ({def: c, state: state}))));
            const activeIndex$ = combineLatest(active$).pipe(map(c => {
                let actives = c.filter(cc => cc.state);
                return actives.length;
            }));
            return activeIndex$.pipe(map(index => ({cellDef: val.def, index: index, isActive: val.isActive})));
        }),
        tap(val => {
            if (val.isActive) {
                const cachedCell = this._cachedCellViews.find(c => c.columnName == val.cellDef.columnName);
                if (cachedCell) {
                    this._viewContainer.insert(cachedCell.viewRef, val.index);
                    const i = this._cachedCellViews.indexOf(cachedCell);
                    this._cachedCellViews.splice(i, 1);
                }
                else {
                    const cellView = this._viewContainer.createEmbeddedView(val.cellDef.template, {}, {index: val.index});
                    UtilityService.applyCellStyling(val.cellDef, cellView, this._cellPadding);
                }
            } else {
                const cachedCell = this._viewContainer.detach(val.index);
                if (cachedCell)
                    this._cachedCellViews.push({columnName: val.cellDef.columnName, viewRef: cachedCell});
            }
        }),
    );


    onDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
}