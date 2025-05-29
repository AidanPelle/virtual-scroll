import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EmbeddedViewRef,
  HostAttributeToken,
  inject,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
  TrackByFunction,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {
  asyncScheduler,
  BehaviorSubject,
  combineLatest,
  combineLatestWith,
  concatWith,
  defer,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  map,
  merge,
  Observable,
  of,
  pairwise,
  ReplaySubject,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  take,
  tap,
  throttleTime
} from 'rxjs';
import { UtilityService } from '../utility.service';
import { RowDefDirective } from '../defs/row-def.directive';
import { CellDefDirective } from '../defs/cell-def.directive';
import { BaseDataSource } from '../data-sources/base-data-source';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { VirtualScrollFooterData } from '../interfaces/footer-data';
import { RowOutletDirective } from '../outlets/row-outlet.directive';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { HeaderCellDefDirective } from '../defs/header-cell-def.directive';
import { HeaderOutletDirective } from '../outlets/header-outlet.directive';
import { SCROLLBAR_WIDTH } from '../constants';

@Component({
  selector: 'virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.scss', './vs-row.scss', './vs-cell.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualScrollComponent<T> implements OnInit, AfterViewInit, AfterContentInit {

  private _hostElement: ElementRef<HTMLElement> = inject(ElementRef);
  canResize = inject(new HostAttributeToken('canResize'), {optional: true}) != null;

  @ViewChild(CdkVirtualScrollViewport) _viewport?: CdkVirtualScrollViewport;
  @ViewChild('headerContainer', { read: ElementRef<HTMLDivElement> }) _headerContainer?: ElementRef<HTMLDivElement>;
  @ViewChildren(RowOutletDirective) _renderedRows!: QueryList<RowOutletDirective<T>>;
  @ViewChildren(HeaderOutletDirective) _renderedHeader!: QueryList<HeaderOutletDirective<T>>;

  @ContentChildren(CellDefDirective, { descendants: true }) _cellDefsContent?: QueryList<CellDefDirective>;
  @ContentChild(RowDefDirective, { read: TemplateRef }) _rowTemplate?: TemplateRef<unknown>;
  @ContentChild(HeaderCellDefDirective, { read: TemplateRef }) _headerTemplate?: TemplateRef<unknown>;
  @ContentChildren(HeaderCellDefDirective, { descendants: true }) _headerCellDefs?: QueryList<HeaderCellDefDirective>;

  protected readonly SCROLLBAR_WIDTH = SCROLLBAR_WIDTH;

  /** Whitespace to be left within a cell for readability. */
  @Input() cellPadding: number = 16;

  /** 
   * The table's source of data, with four options:
   *    - A wrapper around a simple array of data
   *    - An observable that emits the entire set of data when called
   *    - An observable that emits pages of data, when provided the required index and page size
   *    - A custom DataSource that extends BaseDataSource
   */
  @Input()
  set dataSource(source: BaseDataSource<T> | null) {
    if (source instanceof BaseDataSource)
      this._dataSource.next(source);
  }
  private readonly _dataSource = new ReplaySubject<BaseDataSource<T>>(1);

  /**
   * The height of the table in pixels. Default value will be 500, so that the table is visible right off the bat.
   * If a viewport height is supplied as well (heightVh), then this value will be overriden.
   */
  @Input()
  set heightPx(value: number) {
    this._heightPx.next(value);
  }
  private readonly _heightPx = new BehaviorSubject<number>(500);

  /**
   * The height of the table in terms of viewport, ranging from 0-100. When this value is supplied,
   * it will override the heightPx property.
   */
  @Input()
  set heightVh(value: number) {
    this._heightVh.next(value);
  }
  private readonly _heightVh = new BehaviorSubject<number | null>(null);

  /**
   * The height of each row, in pixels. Due to the scrollbar needing to calculate its height based on the number of rows,
   * the height of a given row must stay the same.
   */
  @Input()
  set itemSize(value: number) {
    this._itemSize.next(value);
  }
  protected readonly _itemSize = new BehaviorSubject<number>(48);

  /** A user-defined loading state to allow for external setup/handling */
  @Input() set loading(value: boolean) {
    this._loading.next(value);
  }
  private readonly _loading = new BehaviorSubject<boolean>(false);

  /** The maximum number of rows that we keep rendered outside of the viewport for scrolling consistency */
  @Input()
  set maxRowBuffer(value: number) {
    this._maxRowBuffer.next(value);
  }
  private readonly _maxRowBuffer = new BehaviorSubject<number>(20);

  /** The minimum number of rows that we keep rendered outside of the viewport for scrolling consistency. */
  @Input()
  set minRowBuffer(value: number) {
    this._minRowBuffer.next(value);
  }
  private readonly _minRowBuffer = new BehaviorSubject<number>(15);

  /**
   * The offset to the component height, in pixels. This is primarily used in tandem with the heightVh property to
   * set some dynamic height, with some pixel value offset removed.
   */
  @Input()
  set offset(value: number) {
    this._offset.next(value);
  }
  private readonly _offset = new BehaviorSubject<number>(0);

  /**
   * This value controls the width of the resize bar when canResize is present on wh-virtual-scroll.
   *
   * Increase when you want to make it easier for users to grab, decrease when you need more space
   * allocated for your columns.
   *
   * Note: This value will also affect the rows, and insert an invisible element between them
   * so that they remain aligned with the headers.
   */
  @Input() resizeWidth: number = 8;

  /**
   * Controls if the footer (containing information about the current location in the list) is displayed.
   * 
   * Usually turned off when you'd want to implement a custom display.
  */
  @Input() showFooter = true;

  /** Controls if the header row for each column is displayed. */
  @Input() showHeader = true;

  /**
   * Provides a unique identifier for a given row to virtual scroll, allowing for some optimization by cdk-virtual-scroll.
   *
   * When a row is updated, if the result from the trackBy function is unique, then the DOM will
   * only update the relevant row. Without a trackBy function, the DOM will need to check every row for updates.
   *
   * We add some custom logic to coalesce the result of the trackByFn to the index so that if the row's value is null, it still
   * has a value that is likely to be unique.
   */
  @Input()
  get trackByFn(): TrackByFunction<T> {
    return this._trackByFn;
  }
  set trackByFn(fn: TrackByFunction<T>) {
    const coalesceTrackFn = (index: number, item: T) => fn(index, item) ?? index;
    this._trackByFn = coalesceTrackFn;
  }
  private _trackByFn = (index: number, item: T) => item ?? index;

  /** Emits when we want to apply a static width for a given column, so that the column won't flex grow/shrink. */
  readonly applyFixedWidth = new Subject<[string, number]>();

  /** Emits when we want to re-arrange the columns in a table. */
  readonly moveColumn = new BehaviorSubject<{ fromIndex: number, toIndex: number, isActive: boolean } | null>(null);

  /** Emits when we want to clear all flex, min and max widths applied to a column. For the purpose of applying fixed widths afterwards. */
  readonly removeCellWidths = new Subject<string>();

  /** Scroll events emitted by the end user scrolling in the list. */
  protected readonly _onHorizontalScroll = new Subject<Event>();

  /** The current height of the open page, updated whenever the page resizes. */
  protected readonly _onResize = new BehaviorSubject<HTMLElement | null>(null);

  /** The index of the first element visible on the screen. */
  protected readonly _scrollIndex = new BehaviorSubject<number>(0);

  /** Emits when we want to clear the manually set fixed widths on each of the columns. */
  private readonly _resetSizes = new BehaviorSubject<void>(undefined);

  /** Handles the initial mapping from the contentChildren out to subsequent functions, and allows us access to the current array value. */
  private readonly _cellDefs = new BehaviorSubject<CellDefDirective[]>([]);

  /** Used to force an observable to not start processing until after the view has initialized, so that we have access to dynamic viewChildren. */
  private readonly _afterViewInit = new ReplaySubject<boolean>(1);

  /** Handles skipping checking the current flex state of columns, to avoid performance hits on resizing. */
  private _haxFlexColumns = true;

  /**
   * Handles taking in the current ordering of cell defs in the page, and whenever a drag/drop event occurs, re-arranging
   * the array to match that new info.
   */
  readonly orderedCellDefs$ = this.moveColumn.pipe(
    switchMap(val => {
      if (val !== null) {
        const cells = this._cellDefs.value;
        moveItemInArray(cells, val.fromIndex, val.toIndex);
        this._cellDefs.next(cells);
      }
      return this._cellDefs;
    }),
    shareReplay(1),
  );

  /** Handles mapping from the current ordered list of cell defs, into their active state and index in the list. */
  readonly mappedActiveColumns$ = defer(() => of(null)).pipe(
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

  /**
   * An observable that emits all resize events captured by virtual scroll.
   * This is public so that cell defs can listen to the events and update their active status.
   */
  readonly throttledResize$ = this._onResize.pipe(throttleTime(50, asyncScheduler, { trailing: true })); // Throttle here so that we don't recalc our page too frequently, at most every 50ms

  /** Observable that contains the current horizontal scroll position, along with the total width of the element. */
  private readonly _horizontalScrollData$ = merge(this._onHorizontalScroll.pipe(map(event => event.target as HTMLElement)), this.throttledResize$).pipe(
    filter(element => element != null),
    map(scrollElement => {
      return [scrollElement.scrollLeft, scrollElement.offsetWidth];
    }),
  );

  /**
   * Handles initializing the widths for the container using the first rendered sticky cell,
   * after which scrollValues are supplied by listening to the horizontal scroll events
   *
   * Because this function is only called when cells are being rendered, we know the viewport must exist for that to happen,
   * therefore we can cast the viewport to definitely exist.
   */
  readonly _stickyScrollData$ = this._afterViewInit.pipe(
    filter(() => this._cellDefsContent?.find(cd => cd.isSticky) != null),
    map(() => {
      if (this._headerContainer) {
        const headerElement = this._headerContainer.nativeElement;
        return [headerElement.scrollLeft, headerElement.offsetWidth];
      }
      const viewportElement = this._viewport!.elementRef.nativeElement;
      return [viewportElement.scrollLeft, viewportElement.offsetWidth];
    }),
    take(1),
    concatWith(this._horizontalScrollData$),
    throttleTime(50, asyncScheduler, { trailing: true }),
    distinctUntilChanged((prev, current) => (prev[0] == current[0] && prev[1] == current[1])),
  );

  /** Observable that provides the current height of the open browser, refreshing whenever the page resizes. */
  private readonly _windowHeight$ = this.throttledResize$.pipe(
    map(() => window.innerHeight),
    shareReplay(1),
  );

  /** The current dataSource, that is not null. Handles running onDestroy functions whenever the dataSource changes. */
  protected readonly dataSource$ = this._dataSource.pipe(
    startWith(null),
    pairwise(),
    map(([previous, current]) => {
      previous?.onDestroy();
      return current;
    }),
    filter(source => source != null),
    shareReplay(1)
  );

  /**
   * The current loading state of the dataSource itself.
   * Primarily used on CompleteDataSource or PaginatedDataSource while waiting for asynchronous data to return.
   */
  private readonly _isDataSourceLoading$ = this.dataSource$.pipe(
    switchMap(src => src.loading$),
    startWith(true),
  );

  /** A list of the active columns, filtered by active state. */
  private readonly _filteredActiveColumns$ = this.mappedActiveColumns$.pipe(
    switchMap(cols => combineLatest(cols)),
    map(allColumns => allColumns.filter(c => c.isActive)),
    shareReplay(1),
  );

  /**
   * Display a generic loading state for virtual scroll,
   * based on user-defined loading status along with the current status of the data source.
   */
  protected readonly loading$ = combineLatest([this._loading, this._isDataSourceLoading$]).pipe(
    map(([inputLoading, dataSourceLoading]) => {
      const myLoad = inputLoading || dataSourceLoading;
      return myLoad;
    }),
    shareReplay(1),
  );

  /**
   * A reference to the dataSource as soon as the actual data has been loaded into the class,
   * allowing us to read the length of the returned data.
   */
  private readonly _dataSourcePostLoading$ = this.dataSource$.pipe(
    switchMap(src => src.loading$.pipe(
      filter(loading => loading == false),
      map(() => src),
    )),
    shareReplay(1),
  );

  /**
   * An observable containing the maximum possible height (calculated from user-defined height settings),
   * and the total height of the content inside (from rowSize and total dataset size).
   */
  private readonly possibleHeights$ = combineLatest([this._heightVh, this._heightPx, this._offset, this._itemSize, this._windowHeight$, this._dataSourcePostLoading$]).pipe(
    map(([heightVh, heightPx, offset, itemSize, windowHeight, dataSource]) => {
      const maxPossibleHeight = heightVh != null
        ? windowHeight * heightVh / 100 - offset
        : heightPx - offset;

      const totalContentHeight = itemSize * dataSource.length;

      return [maxPossibleHeight, totalContentHeight];
    }),
    shareReplay(1),
  );

  /**
   * An observable containing the current state of the component's horizontal scrollbar,
   * based on if the total minimum widths are wider than the container's width.
   * 
   * Used to adjust tableHeight to account for the extra padding.
   */
  private readonly _hasHorizontalScrollbar$ = this._filteredActiveColumns$.pipe(
    combineLatestWith(this.applyFixedWidth.pipe(startWith(null)), this._resetSizes, this.throttledResize$),
    map(([activeCells]) => {
      let totalWidth = activeCells.reduce((a, b) => a + (b.cellDef.fixedWidth ?? b.cellDef.minWidth), 0);
      if (this.canResize)
        totalWidth += activeCells.length * this.resizeWidth;

      return totalWidth > this._hostElement.nativeElement.offsetWidth;
    }),
  );

  /**
   * An observable containing the current state of the component's vertical scrollbar.
   * 
   * Used to offset the header's total width by the scrollbar (to keep aligned with the table columns).
   */
  readonly _hasVerticalScrollBar$ = combineLatest([this.possibleHeights$, this._hasHorizontalScrollbar$]).pipe(
    map(([[maxPossibleHeight, totalContentHeight], hasHorizontalScrollbar]) => {
      return totalContentHeight + (hasHorizontalScrollbar ? SCROLLBAR_WIDTH : 0) > maxPossibleHeight;
    }),
  );

  /**
   * Calculates the current height of the table, allowing it to resize properly when the content or window size changes.
   */
  readonly _tableHeight$ = combineLatest([this.possibleHeights$, this._hasHorizontalScrollbar$]).pipe(
    map(([[maxPossibleHeight, totalContentHeight], hasHorizontalScrollbar]) => Math.min(maxPossibleHeight, totalContentHeight + (hasHorizontalScrollbar ? 16 : 0))),
    shareReplay(1),
  );

  /**
   * Whenever the sticky cells that are rendered have changed for any reason, we get a new reference to a sticky cell,
   * retrieving its current horizontal position in a list.
   */
  readonly stickyCellData$ = this.loading$.pipe(
    switchMap(loading => {
      if (this.showHeader)
        return of(null);
      return of(null).pipe(
        filter(() => loading === false),  // whenever loading goes to false, refresh our dataSource
        switchMap(() => this.dataSource$),
        switchMap(source => {
          return source.dataListener.pipe(    // whenever dataSource changes,
            filter(() => source.length > 0),  // we need the next instance where length > 0
            take(1),
          );
        }),
      );
    }),
    // Then we need to get a static reference to a rendered sticky cell
    switchMap(() => this._getStickyCell()),
    map(stickyCell => {
      const stickyElement = stickyCell.view!.rootNodes[0] as HTMLElement;
      const previousSibling = stickyElement.previousElementSibling as HTMLElement | null;
      return [previousSibling, stickyElement] as const
    }),
    // Switchmap into resize so that we re-trigger calculating the offset values when the page resizes
    switchMap(([previousSibling, stickyElement]) => this.throttledResize$.pipe(map(() => {
      // We get the previous sibling + its width instead of the offset of the current sibling, because the current sibling is sticky and so
      // We don't know its original position
      return [(previousSibling?.offsetLeft ?? 0) + (previousSibling?.offsetWidth ?? 0), stickyElement?.offsetWidth ?? 0] as const;
    }))),
  );

  /** Calculates if we want to apply the sticky shadow styling to the current sticky cell, given how far we've horizontally scrolled. */
  readonly applyStickyShadow$ = combineLatest([this._stickyScrollData$, this.stickyCellData$]).pipe(
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
  );

  /** The maximum size of the buffer in pixels, mapped from the buffer size in terms of rows. */
  protected readonly maxBuffer$ = UtilityService.mapRowBufferToPx(this._maxRowBuffer, this._itemSize);

  /** The minimum size of the buffer in pixels, mapped from the buffer size in terms of rows. */
  protected readonly minBuffer$ = UtilityService.mapRowBufferToPx(this._minRowBuffer, this._itemSize);

  /** Used to keep the horizontal scrolling of the header row and the container in sync, based on whenever either of them emit a scroll event. */
  private readonly syncHorizontalScroll$ = this._horizontalScrollData$.pipe(
    map(([scrollLeft]) => scrollLeft),
    distinctUntilChanged(),
    tap(scrollLeft => {
      if (this._headerContainer && this._headerContainer.nativeElement.scrollLeft !== scrollLeft)
        this._headerContainer.nativeElement.scrollLeft = scrollLeft;

      if (this._viewport && this._viewport.elementRef.nativeElement.scrollLeft !== this._viewport.elementRef.nativeElement.scrollLeft)
        this._viewport.elementRef.nativeElement.scrollLeft = scrollLeft;
    }),
  );

  /** Throttle the current scroll events so that we don't have to process every single scroll event that comes through, for performance. */
  private readonly _throttledScrollIndex$ = this._scrollIndex.pipe(throttleTime(50, asyncScheduler, { trailing: true }));

  /** Using the current height of the table and the height of a given row, calculate how many rows are currently visible. */
  private readonly _numberOfVisibleRows$ = combineLatest([this._tableHeight$, this._itemSize]).pipe(map(([tableHeight, itemSize]) => {
    return Math.ceil(tableHeight / itemSize);
  }), shareReplay(1));

  /**
   * Handles displaying the start, end, and count items for the current list
   *
   * We listen to dataSource and the dataListener so that we can update scroll count appropriately on both
   */
  protected readonly footerData$ = combineLatest([this._throttledScrollIndex$, this._numberOfVisibleRows$, this.dataSource$, this.dataSource$.pipe(switchMap(src => src.dataListener))]).pipe(
    map(([scrollIndex, numberOfVisibleRows, dataSource]) => {
      const start = dataSource.length == 0 ? 0 : scrollIndex;
      const footerData: VirtualScrollFooterData = {
        start: start,
        // The -1 on number of visible rows accounts for that the end is inclusive, not exclusive.
        end: Math.min(start + numberOfVisibleRows - 1, dataSource.length - 1),
        itemCount: dataSource.length,
      };
      return footerData;
    }),
    startWith({ start: -1, end: -1, itemCount: 0 }),
    shareReplay(1),
  );

  ngOnInit(): void {
    this.syncHorizontalScroll$.subscribe();
  }

  ngAfterContentInit(): void {
    this._cellDefs.next(this._cellDefsContent!.toArray());
  }

  ngAfterViewInit(): void {
    this._afterViewInit.next(true);
  }

  /**
   * Triggered by the resizable directive, this function will handle setting fixed widths on all columns,
   * then emitting the appropriate resize events to the active column managers.
   */
  protected async onResize(differential: number, columnName: string) {
    // Since resizing only happens within the header row, if this function is called we can assume that the header exists
    if (!this._renderedHeader?.get(0))
      return;
    const headerRow = this._renderedHeader.get(0);
    // If any cell def does not have a fixed width, we need to set them to fixed
    if (this._haxFlexColumns) {
      const obs = this.mappedActiveColumns$.pipe(
        switchMap(list => combineLatest(list)),
        tap(list => {
          list.forEach(cell => {
            // Skip any cells that already have a fixed width defined
            if (cell.cellDef.fixedWidth)
              return;

            // If the cell is active, set the rendered column's current width as the fixed width
            if (cell.isActive) {
              const renderedCell = headerRow?._columnManager?.renderedCellViews.find(c => c.columnName === cell.cellDef.columnName);
              if (!renderedCell)
                return;
              cell.cellDef.fixedWidth = renderedCell.view.rootNodes[0].getBoundingClientRect().width;

              this.removeCellWidths.next(cell.cellDef.columnName);
              this.applyFixedWidth.next([cell.cellDef.columnName, cell.cellDef.fixedWidth ?? 0]);

              // If the cell is not active, set the fixed width to the minimum width of the column
            } else {
              cell.cellDef.fixedWidth = cell.cellDef.minWidth
            }
          });
        }),
      );
      await firstValueFrom(obs);
      this._haxFlexColumns = false;
    }

    // Then apply the differential to the affected cellDef, and emit the resize observable
    const modifiedCell = this._cellDefsContent?.find(c => c.columnName === columnName);
    if (!modifiedCell)
      return;

    const newWidth = (modifiedCell.fixedWidth ?? modifiedCell.minWidth) + differential;
    modifiedCell.fixedWidth = newWidth;
    this.applyFixedWidth.next([columnName, newWidth]);
  }

  /** Whenever we emit to reset the column sizes back to default, handle resetting the modified fixed widths, and re-rendering the rows. */
  protected onResetSizes(): void {
    // Reset any modified fixed widths
    this._cellDefsContent?.forEach(c => c.fixedWidth = null);
    this._haxFlexColumns = true;

    // re-render the rows. We don't want to manually reset styles in case the user has set styles themselves
    this._renderedHeader.forEach(h => h.renderRow());
    this._renderedRows.forEach(r => r.renderRow());
    this._resetSizes.next();
  }

  /**
   * A function to retrieve a currently rendered sticky cell,
   * or if none exists, the next sticky cell to render.
   */
  private _getStickyCell = (): Observable<{
    row: RowOutletDirective<T>;
    view: EmbeddedViewRef<unknown> | null;
  }> => {
    return this._afterViewInit.pipe(  // getStickyCell needs to wait for afterViewInit$ to fire, so that rowOutlets.changes will be populated
      switchMap(() => {
        if (this.showHeader)
          return of(this._renderedHeader.toArray());
        return this._renderedRows.changes.pipe(
          map(() => this._renderedRows.toArray())
        );
      }),
      switchMap((res: RowOutletDirective<T>[]) => {
        const stickies = res.map(row => row.renderedSticky$.pipe(map(r => ({ row: row, view: r }))));
        const taggedStickies = stickies.map((obs$, index) => obs$.pipe(map(value => ({ source: index, value }))));
        return merge(...taggedStickies).pipe(
          filter(item => item.value.view != null),
          take(1),
          switchMap(item => stickies[item.source])
        );
      }),
    );
  }
}
