import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { asyncScheduler, BehaviorSubject, combineLatest, map,shareReplay, startWith, throttleTime } from 'rxjs';
import { UtilityService } from '../utility.service';
import { CustomDataSource } from '../data-sources/custom-data-source';
import { RowDefDirective } from '../defs/row-def.directive';

@Component({
  selector: 'virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrl: './virtual-scroll.component.scss'
})
export class VirtualScrollComponent<T> {


  /**
   * A temporary way to pass in some sort of data to this component, while I set up handling table height etc.
   */
  @Input() set arraySource(data: T[]) {
    this._arraySource.next(data);
  }
  protected _arraySource = new BehaviorSubject<T[]>([]);


  /**
   * The height of each row, in pixels. Due to the scrollbar needing to calculate its height based on the number of rows,
   * the height of a given row must stay the same.
   */
  @Input() set itemSize(value: number) {
    this._itemSize.next(value);
  }
  private _itemSize = new BehaviorSubject<number>(48);


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

  /**
   * The minimum size of the buffer in pixels, mapped from the buffer size in terms of rows
   */
  protected minBuffer$ = UtilityService.mapRowBufferToPx(this._minRowBuffer, this._itemSize);


  /**
   * The maximum size of the buffer in pixels, mapped from the buffer size in terms of rows
   */
  protected maxBuffer$ = UtilityService.mapRowBufferToPx(this._maxRowBuffer, this._itemSize);


  protected dataSource$ = this._arraySource.pipe(
    map(array => {
      return new CustomDataSource(array);
    }),
    shareReplay(1),
  );
  private isDataSourceLoading$ = this.dataSource$.pipe(
    map(() => false),
    startWith(true),
    shareReplay(1)
  );


  protected loading$ = combineLatest([this._inputLoading, this.isDataSourceLoading$]).pipe(
    map(([inputLoading, dataSourceLoading]) => {
      const myLoad = inputLoading || dataSourceLoading;
      return myLoad;
    }),
  );


  /**
   * The current height of the open page, updated whenever the page resizes
   */
  protected resizeEvent = new BehaviorSubject<void>(undefined);
  private _windowHeight = this.resizeEvent.pipe(
    throttleTime(50, asyncScheduler, { trailing: true }),   // Throttle here so that we don't recalc our page too frequently, at most every 50ms
    map(() => window.innerHeight),
    shareReplay(1),
  );

  

  /////////////// COMPUTED PROPERTIES //////////////
  protected tableHeight$ = combineLatest([this._heightVh, this._heightPx, this._offset, this._itemSize, this._windowHeight, this._arraySource]).pipe(
    map(([heightVh, heightPx, offset, itemSize, windowHeight, arraySource]) => {
      const maxPossibleHeight = heightVh != null
        ? windowHeight * heightVh / 100 - offset
        : heightPx - offset;

      const totalContentHeight = itemSize * arraySource.length;

      const tableHeight = Math.min(maxPossibleHeight, totalContentHeight);

      return tableHeight;
    }),
    shareReplay(1),
  );











  @ContentChild(RowDefDirective, { read: TemplateRef })
  protected rowTemplate!: TemplateRef<any>;
}
