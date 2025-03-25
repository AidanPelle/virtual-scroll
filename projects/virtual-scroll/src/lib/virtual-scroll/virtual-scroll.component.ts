import { AfterContentInit, Component, ContentChild, ContentChildren, Input, QueryList, TemplateRef, TrackByFunction } from '@angular/core';
import { asyncScheduler, BehaviorSubject, combineLatest, defer, map, of, shareReplay, startWith, Subject, switchMap, throttleTime } from 'rxjs';
import { UtilityService } from '../utility.service';
import { CustomDataSource } from '../data-sources/custom-data-source';
import { RowDefDirective } from '../defs/row-def.directive';
import { CellDefDirective } from '../defs/cell-def.directive';
import { BaseDataSource } from '../data-sources/base-data-source';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.scss', './vs-row.scss', './vs-cell.scss'],
})
export class VirtualScrollComponent<T> implements AfterContentInit {


  /**
   * A temporary way to pass in some sort of data to this component, while I set up handling table height etc.
   */
  @Input() set dataSource(dataSource: BaseDataSource<T> | null) {
    if (dataSource instanceof BaseDataSource)
      this._dataSource.next(dataSource);
  }
  protected _dataSource = new Subject<BaseDataSource<T>>();
  protected dataSource$ = this._dataSource.pipe(shareReplay(1));


  /**
   * The height of each row, in pixels. Due to the scrollbar needing to calculate its height based on the number of rows,
   * the height of a given row must stay the same.
   */
  @Input() set itemSize(value: number) {
    this._itemSize.next(value);
  }
  private _itemSize = new BehaviorSubject<number>(48);
  protected itemSize$ = this._itemSize.asObservable();


  /**
   * The height of the table in terms of viewport, ranging from 0-100. When this value is supplied,
   * it will override the heightPx property.
   */
  @Input() set heightVh(value: number) {
    this._heightVh.next(value);
  }
  private _heightVh = new BehaviorSubject<number | null>(null);


  /**
   * The height of the table in pixels. Default value will be 500, so that the table is visible right off the bat.
   * If a viewport height is supplied as well (heightVh), then this value will be overriden.
   */
  @Input() set heightPx(value: number) {
    this._heightPx.next(value);
  }
  private _heightPx = new BehaviorSubject<number>(500);


  /**
   * The offset to the component height, in pixels. This is primarily used in tandem with the heightVh property to
   * set some dynamic height, with some pixel value offset removed.
   */
  @Input() set offset(value: number) {
    this._offset.next(value);
  }
  private _offset = new BehaviorSubject<number>(0);


  /**
   * The minimum number of rows that we keep rendered outside of the viewport for scrolling consistency
   */
  @Input() set minRowBuffer(value: number) {
    this._minRowBuffer.next(value);
  }
  private _minRowBuffer = new BehaviorSubject<number>(15);


  /**
   * The maximum number of rows that we keep rendered outside of the viewport for scrolling consistency
   */
  @Input() set maxRowBuffer(value: number) {
    this._maxRowBuffer.next(value);
  }
  private _maxRowBuffer = new BehaviorSubject<number>(20);


  @Input() set loading(value: boolean) {
    this._inputLoading.next(value);
  }
  private _inputLoading = new BehaviorSubject<boolean>(false);



  @Input() cellPadding: number = 16;


  /**
   * Provides a unique identifier for a given row to virtual scroll, allowing for some optimization by cdk-virtual-scroll.
   * 
   * Essentially, it means that when a row is updated, if the result from the trackBy function is unique, then the DOM will
   * only update the relevant row. Without a trackBy function, the DOM will need to check every row for updates.
   * 
   * We add some custom logic to coalesce the result of the trackByFn to the index, so that if the row's value is null, it still
   * has a value that is likely to be unique.
   */
  @Input() public set trackByFn(fn: TrackByFunction<T>) {
    const coalesceTrackFn = (index: number, item: any) => fn(index, item) ?? index;
    this._trackByFn = coalesceTrackFn;
  }
  private _trackByFn = (index: number, item: any) => item ?? index;
  public get trackByFn(): TrackByFunction<T> {
    return this._trackByFn;
  }

  /**
   * The minimum size of the buffer in pixels, mapped from the buffer size in terms of rows
   */
  protected minBuffer$ = UtilityService.mapRowBufferToPx(this._minRowBuffer, this.itemSize$);

  items = Array.from({ length: 100 }).map((_, i) => `Item #${i}`);
  /**
   * The maximum size of the buffer in pixels, mapped from the buffer size in terms of rows
   */
  protected maxBuffer$ = UtilityService.mapRowBufferToPx(this._maxRowBuffer, this.itemSize$);


  private _isDataSourceLoading$ = this.dataSource$.pipe(
    map(() => false),
    startWith(true),
    shareReplay(1)
  );


  protected loading$ = combineLatest([this._inputLoading, this._isDataSourceLoading$]).pipe(
    map(([inputLoading, dataSourceLoading]) => {
      const myLoad = inputLoading || dataSourceLoading;
      return myLoad;
    }),
  );


  /**
   * The current height of the open page, updated whenever the page resizes
   */
  protected resizeEvent = new BehaviorSubject<void>(undefined);


  /**
   * And observable that emits all resize events captured by virtual scroll.
   * This is public so that cell defs can listen to the events and update their active status.
   */
  public resize$ = this.resizeEvent.pipe(throttleTime(50, asyncScheduler, { trailing: true })); // Throttle here so that we don't recalc our page too frequently, at most every 50ms
  private _windowHeight = this.resize$.pipe(
    map(() => window.innerHeight),
    shareReplay(1),
  );



  /////////////// COMPUTED PROPERTIES //////////////
  protected tableHeight$ = combineLatest([this._heightVh, this._heightPx, this._offset, this.itemSize$, this._windowHeight, this.dataSource$]).pipe(
    map(([heightVh, heightPx, offset, itemSize, windowHeight, dataSource]) => {
      const maxPossibleHeight = heightVh != null
        ? windowHeight * heightVh / 100 - offset
        : heightPx - offset;

      const totalContentHeight = itemSize * dataSource.length;

      const tableHeight = Math.min(maxPossibleHeight, totalContentHeight);

      return tableHeight;
    }),
    shareReplay(1),
  );


  @ContentChild(RowDefDirective, { read: TemplateRef })
  protected rowTemplate?: TemplateRef<any>;


  @ContentChildren(CellDefDirective, { descendants: true })
  private cellDefs?: QueryList<CellDefDirective>;


  public moveItem = new BehaviorSubject<{ fromIndex: number, toIndex: number } | null>(null);

  private cellDefs$ = new BehaviorSubject<CellDefDirective[]>([]);

  public orderedCellDefs$ = this.moveItem.pipe(
    switchMap(val => {
      if (val !== null) {
        const cells = this.cellDefs$.value;
        moveItemInArray(cells, val.fromIndex, val.toIndex);
        this.cellDefs$.next(cells);
      }
      return this.cellDefs$;
    }),
    shareReplay(1),
  );

  public mappedActiveColumns$ = defer(() => of(null)).pipe(
    switchMap(() => {
      const obsList = this.orderedCellDefs$.pipe(
        map(cellDefList => {
          const obsList2 = cellDefList.map((cellDef, baseIndex) => {
            return cellDef.activeState$.pipe(map(val => {
              return { cellDef: cellDef, baseIndex: baseIndex, isActive: val }
            }));
          });
          return obsList2;
        }),
      );
      return obsList;
    }),
    shareReplay(1),
  );

  ngAfterContentInit(): void {
    this.cellDefs$.next(this.cellDefs?.toArray()!);
  }
}
