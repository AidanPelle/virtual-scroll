import { AfterContentInit, Component, ContentChild, ContentChildren, Input, QueryList, TemplateRef, TrackByFunction, ViewChild, ViewChildren } from '@angular/core';
import { asyncScheduler, BehaviorSubject, combineLatest, concat, concatWith, defer, distinctUntilChanged, filter, map, merge, of, pairwise, shareReplay, startWith, Subject, switchMap, take, takeUntil, tap, throttleTime } from 'rxjs';
import { UtilityService } from '../utility.service';
import { CustomDataSource } from '../data-sources/custom-data-source';
import { RowDefDirective } from '../defs/row-def.directive';
import { CellDefDirective } from '../defs/cell-def.directive';
import { BaseDataSource } from '../data-sources/base-data-source';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { VirtualScrollFooterData } from '../interfaces/footer-data';
import { RowOutletDirective } from '../outlets/row-outlet.directive';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

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
  protected dataSource$ = this._dataSource.pipe(
    startWith(null),
    pairwise(),
    map(([previous, current]) => {
      previous?.onDestroy.next();
      previous?.onDestroy.complete();
      return current;
    }),
    filter(source => source != null),
    shareReplay(1)
  );


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


  @Input() showFooter = true;


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

  private get isStickyEnabled(): boolean {
    return this.cellDefs?.find(cd => cd.sticky) != null;
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


  /**
   * Display a generic loading state for virtual scroll, based on user-defined loading status along with the current status of the data source.
   */
  protected loading$ = combineLatest([this._inputLoading, this._isDataSourceLoading$]).pipe(
    map(([inputLoading, dataSourceLoading]) => {
      const myLoad = inputLoading || dataSourceLoading;
      return myLoad;
    }),
  );


  /**
   * The current height of the open page, updated whenever the page resizes
   */
  protected resizeEvent = new BehaviorSubject<HTMLElement | null>(null);


  /**
   * And observable that emits all resize events captured by virtual scroll.
   * This is public so that cell defs can listen to the events and update their active status.
   */
  public resize$ = this.resizeEvent.pipe(throttleTime(50, asyncScheduler, { trailing: true })); // Throttle here so that we don't recalc our page too frequently, at most every 50ms
  private _windowHeight = this.resize$.pipe(
    map(() => window.innerHeight),
    shareReplay(1),
  );
  
  
  protected onScroll = new Subject<Event>();
  private horizontalScroll$ = merge(this.onScroll.pipe(map(scroll => scroll.target as HTMLElement)), this.resize$).pipe(
    filter(() => this.isStickyEnabled),
    filter(element => element != null),
    throttleTime(50, asyncScheduler, { trailing: true }),
    map(scrollElement => {
      return [scrollElement.scrollLeft, scrollElement.offsetWidth];
    }),
  );

  private horizontalScrollData$ = defer(() => of(null)).pipe(
    switchMap(() => this.getStickyCell()),
    map(stickyCell => {
      const parent = (stickyCell.rootNodes[0] as HTMLElement).parentElement!;
      return [parent.scrollLeft, parent.offsetWidth];
    }),
    tap(val => val),
    concatWith(this.horizontalScroll$),
    distinctUntilChanged((prev, current) => (prev[0] == current[0] && prev[1] == current[1])),
  )
  
  @ViewChild(CdkVirtualScrollViewport) viewport?: CdkVirtualScrollViewport;

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

  stickyCellData$ = this.loading$.pipe(       // whenever loading goes to false, refresh our source looking
    filter(loading => loading === false),
    switchMap(() => this.dataSource$),
    switchMap(source => {
      return source.dataListener.pipe(    // whenever dataSource changes,
        filter(() => source.length > 0),  // we need the next instance where length > 0
        take(1),
      );
    }),
    // Then we need to get a static reference to a rendered sticky cell
    switchMap(() => this.getStickyCell()),
    map(stickyCell => {
      const stickyElement = stickyCell.rootNodes[0] as HTMLElement;
      const previousSibling = stickyElement.previousElementSibling as HTMLElement | null;
      return [previousSibling, stickyElement]
    }),
    // Switchmap into resize so that we re-trigger calculating the offset values when the page resizes
    switchMap(([previousSibling, stickyElement]) => this.resize$.pipe(map(() => {
      // We get the previous sibling + its width instead of the offset of the current sibling, because the current sibling is sticky and so
      // we don't know its original position
      return [(previousSibling?.offsetLeft ?? 0) + (previousSibling?.offsetWidth ?? 0) , stickyElement?.offsetWidth ?? 0];
    }))),
  );

  public applyStickyShadow$ = combineLatest([this.horizontalScrollData$, this.stickyCellData$]).pipe(
    map(([[scrollPosition, containerWidth], [cellPosition, cellWidth]]) => {
      if (cellPosition < scrollPosition)
        return "sticky-right-shadow";
      else if (cellPosition + cellWidth > scrollPosition + containerWidth)
        return "sticky-left-shadow";
      else
        return null;
    }),
    distinctUntilChanged(),
    shareReplay(1),
  )

  getStickyCell() {
    return this.rowOutlets.changes.pipe(
      switchMap(() => {
        const stickies = this.rowOutlets.map(row => row.renderedSticky$);
        return merge(...stickies).pipe(
          filter(cell => cell != null),
        );
      }),
      take(1),
    );
  }

  protected scrollIndex = new BehaviorSubject<number>(0);

  /**
   * Throttle the current scroll events so that we don't have to process every single scroll event that comes through, for performance.
   */
  private scroll$ = this.scrollIndex.pipe(throttleTime(50, asyncScheduler, { trailing: true }));

  private _numberOfVisibleRows$ = combineLatest([this.tableHeight$, this.itemSize$]).pipe(map(([tableHeight, itemSize]) => Math.ceil(tableHeight / itemSize)), shareReplay(1));


  /**
   * Handles displaying the start, end, and count items for the current list
   * 
   * We listen to dataSource and the dataListener so that we can update scroll count appropriately on both
   */
  protected footerData$ = combineLatest([this.scroll$, this._numberOfVisibleRows$, this.dataSource$, this.dataSource$.pipe(switchMap(src => src.dataListener))]).pipe(
    map(([scrollIndex, numberOfVisibleRows, dataSource]) => {
      const start = dataSource.length == 0 ? 0 : scrollIndex;
      const footerData: VirtualScrollFooterData = {
        start: start,
        end: Math.min(start + numberOfVisibleRows, dataSource.length - 1),
        itemCount: dataSource.length,
      };
      return footerData;
    }),
    startWith({start: -1, end: -1, itemCount: 0}),
    shareReplay(1),
  );


  @ContentChild(RowDefDirective, { read: TemplateRef })
  protected rowTemplate?: TemplateRef<any>;


  @ContentChildren(CellDefDirective, { descendants: true })
  private cellDefs?: QueryList<CellDefDirective>;

  /**
   * A reference to the list of the current rows that are rendered to the screen.
   */
  @ViewChildren(RowOutletDirective)
  protected rowOutlets!: QueryList<RowOutletDirective<T>>;


  public moveItem = new BehaviorSubject<{ fromIndex: number, toIndex: number, isActive: boolean } | null>(null);

  /**
   * Handles the initial mapping from the contentChildren out to subsequent functions, and allows us access to the current array value.
   */
  private cellDefs$ = new BehaviorSubject<CellDefDirective[]>([]);


  /**
   * Handles taking in the current ordering of cell defs in the page, and whenever a drag/drop event occurs, re-arranging
   * the array to match that new info.
   */
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


  /**
   * Handles mapping from the current ordered list of cell defs, into their active state and index in the list.
   */
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
