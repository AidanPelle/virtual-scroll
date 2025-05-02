import { Directive, EmbeddedViewRef, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { CellOutletDirective } from "./cell-outlet.directive";
import { ColumnManager } from "../column-manager/column-manager";
import type { VirtualScrollComponent } from "../virtual-scroll/virtual-scroll.component";   // Using type instead of direct import to fix circular import references
import { BehaviorSubject, Subject, takeUntil } from "rxjs";
import { CellContext } from "../interfaces/cell-context";

@Directive({
  selector: '[rowOutlet]',
})
export class RowOutletDirective<T> implements OnInit, OnDestroy {

  private _viewContainer = inject(ViewContainerRef);
  public _columnManager?: ColumnManager<T>;

  @Input() rowTemplate?: TemplateRef<unknown>;

  @Input() defaultRowTemplate!: TemplateRef<unknown>;

  @Input() sliderTemplate!: TemplateRef<unknown>;

  @Input() virtualScroll!: typeof VirtualScrollComponent.prototype;

  @Input() item!: T;

  @Input() index!: number;

  private _onDestroy = new Subject<void>();

  protected renderSticky = new BehaviorSubject<EmbeddedViewRef<CellContext<T>> | null>(null);
  public renderedSticky$ = this.renderSticky.pipe(takeUntil(this._onDestroy));

  ngOnInit(): void {
    this.renderRow();
  }

  public rowView?: EmbeddedViewRef<unknown>;

  renderRow(): void {
    // Remove any currently rendered items from the view
    this._viewContainer.clear();

    // When there's no template provided from the user, we can substitute with some default template
    this.rowView = this._viewContainer.createEmbeddedView(this.rowTemplate ?? this.defaultRowTemplate, {
      $implicit: this.item,
      index: this.index,
    });

    const cellOutlet = CellOutletDirective.mostRecentView;
    if (!cellOutlet)
      throw Error('No vs-row detected on rowDef, cannot render cells');


    this.rowView.rootNodes[0].classList.add('vs-row');
    this.rowView.rootNodes[0].classList.add('vs-row-border');

    this._columnManager?.onDestroy();
    this.initColumnManager(cellOutlet);
  }

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

  ngOnDestroy(): void {
    this._columnManager?.onDestroy();
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
