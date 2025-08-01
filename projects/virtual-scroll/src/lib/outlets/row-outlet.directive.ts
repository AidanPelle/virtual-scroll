import { Directive, EmbeddedViewRef, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { CellOutletDirective } from "./cell-outlet.directive";
import { ColumnManager } from "../column-manager/column-manager";
import type { VirtualScrollComponent } from "../virtual-scroll/virtual-scroll.component";   // Using type instead of direct import to fix circular import references
import { BehaviorSubject, delay, filter, of, Subject, takeUntil } from "rxjs";
import { CellContext } from "../interfaces/cell-context";
import { RENDER_DELAY } from "../constants";
import { BaseDataSource } from "../data-sources/base-data-source";
import { RowContext } from "../interfaces/row-context";

@Directive({
  selector: '[rowOutlet]',
})
export class RowOutletDirective<T> implements OnInit, OnDestroy {

  private _viewContainer = inject(ViewContainerRef);

  /** The helper class that handles rendering and destroying columns within a row, to separate out logic. */
  public _columnManager?: ColumnManager<T>;

  /** A custom template defined by the user for how they want to display a row in the table. */
  @Input() rowTemplate?: TemplateRef<RowContext<T>>;

  /** A fallback row template for when none has been defined by the user. */
  @Input() defaultRowTemplate!: TemplateRef<RowContext<T>>;

  /**
   * A template defined internally for displaying the loading animation on rows while asynchronously waiting for data,
   * or whipping the scrollbar.
   */
  @Input() loadingRowTemplate!: TemplateRef<RowContext<T>>;

  /** A template defined internally for the slider between the columns, for resizing columns. */
  @Input() sliderTemplate!: TemplateRef<unknown>;

  /** A reference to the parent component, using typeof to handle circular references. */
  @Input() virtualScroll!: typeof VirtualScrollComponent.prototype;

  /** A reference to the related object for this given row in the overarching list. */
  @Input()
  set item(value: T) {
    this._item = value;
    this._updateRowContext();
    if (this._columnManager)
      this._columnManager.setItem(value);
  }
  get item(): T {
    return this._item;
  }
  private _item!: T;

  /** The index at which this row exists in the list. */
  @Input()
  set index(value: number) {
    this._index = value;
    this._updateRowContext();
    if (this._columnManager)
      this._columnManager.setRowIndex(value);
  }
  get index(): number {
    return this._index;
  }
  private _index!: number;

  /**
   * The smallest value which a row can be.
   * Applying this makes the loading rows and header row take the proper size.
   */
  @Input()
  set rowMinWidth(value: number | null) {
    this._rowMinWidth = value;
    this._applyMinWidth();
  }
  get rowMinWidth() {
    return this._rowMinWidth;
  }
  private _rowMinWidth: number | null = null;
  

  /** The source object currently in use, used to find if we need to skip the loading animation for a row. */
  @Input() dataSource?: BaseDataSource<T> | null;

  /** A reference to the currently rendered row template, used for adding css classes. */
  public rowView?: EmbeddedViewRef<RowContext<T>>;

  /** BehaviorSubject that emits whenever the column manager renders a sticky column. */
  protected readonly renderSticky = new BehaviorSubject<EmbeddedViewRef<CellContext<T>> | null>(null);
  
  /** Subject to handle cleaning up ongoing observables when this row no longer exists. */
  private readonly _onDestroy = new Subject<void>();
  
  /** A reference to the renderSticky BehaviorSubject, scoped for when this row is destroyed. */
  public renderSticky$ = this.renderSticky.pipe(takeUntil(this._onDestroy));

  ngOnInit(): void {
    if (this.dataSource?.skipLoadAnimation(this.index)) {
      this._renderRow();
      return;
    }

    this._renderPlaceholderRow();
    of(0).pipe(
      delay(RENDER_DELAY),
      takeUntil(this._onDestroy),
      filter(() => this.item !== undefined)
    ).subscribe(() => this._renderRow());
  }  

  /** Renders the default loading row animation while we wait for the real data. */
  _renderPlaceholderRow() {
    // Remove any currently rendered items from the view
    this._viewContainer.clear();

    this.rowView = this._viewContainer.createEmbeddedView(this.loadingRowTemplate);
    this.rowView.rootNodes[0].children[0].style.animationDelay = '-' + ((this.index % 10) / 2) + 's';
    this._applyMinWidth();
  }

  /** Renders the row template (custom if provided, default otherwise) and hands off to the column manager for individual columns. */
  _renderRow(): void {
    // Remove any currently rendered items from the view
    this._viewContainer.clear();

    // When there's no template provided from the user, we can substitute with some default template
    this.rowView = this._viewContainer.createEmbeddedView(this.rowTemplate ?? this.defaultRowTemplate, {
      $implicit: this.item,
      index: this.index,
    });
    this._applyMinWidth();

    const cellOutlet = CellOutletDirective.mostRecentView;
    if (!cellOutlet)
      throw Error('No vs-row detected on rowDef, cannot render cells');


    this.rowView.rootNodes[0].classList.add('vs-row');
    this.rowView.rootNodes[0].classList.add('vs-row-border');

    this._columnManager?.onDestroy();
    this.initColumnManager(cellOutlet);
  }

  /** Just instantiates this row's column manager. */
  protected initColumnManager(cellOutlet: CellOutletDirective): void {
    this._columnManager = new ColumnManager(
      cellOutlet.viewContainer,
      this.virtualScroll,
      this.item,
      this.index,
      this.renderSticky,
      this.sliderTemplate,
      false,
      [],
      undefined,
    );
  }

  /** Handles updating the context provided to the row template with the current context, whenever references change. */
  private _updateRowContext(): void {
    if (this._viewContainer.get(0)) {
      const context = (this._viewContainer.get(0) as EmbeddedViewRef<RowContext<T>>).context;
      context.$implicit = this._item;
      context.index = this._index;
    }
  }

  private _applyMinWidth(): void {
    if (this.rowView)
      this.rowView.rootNodes[0].style.minWidth = `max(100%, ${this.rowMinWidth ?? 0}px)`;
  }

  ngOnDestroy(): void {
    this._columnManager?.onDestroy();
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
