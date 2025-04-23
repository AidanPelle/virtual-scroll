import { Directive, EmbeddedViewRef, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { CellOutletDirective } from "./cell-outlet.directive";
import { ColumnManager } from "../column-manager/column-manager";
import type { VirtualScrollComponent } from "../virtual-scroll/virtual-scroll.component";   // Using type instead of direct import to fix circular import references
import { BehaviorSubject, Subject, takeUntil } from "rxjs";
import type { HeaderCellDefDirective } from "../defs/header-cell-def.directive";

@Directive({
  selector: '[rowOutlet]',
})
export class RowOutletDirective<T> implements OnInit, OnDestroy {

  private _viewContainer = inject(ViewContainerRef);
  public _columnManager?: ColumnManager<T>;

  @Input() rowTemplate?: TemplateRef<any>;

  @Input() defaultRowTemplate!: TemplateRef<any>;

  @Input() cellPadding!: number;

  @Input() mappedActiveColumns$!: typeof VirtualScrollComponent.prototype.mappedActiveColumns$;

  @Input() moveItem!: typeof VirtualScrollComponent.prototype.moveItem;

  @Input() applyStickyShadow!: typeof VirtualScrollComponent.prototype.applyStickyShadow$;
  
  @Input() removeCellWidths$!: typeof VirtualScrollComponent.prototype.removeCellWidths;

  @Input() applyFixedWidths$!: typeof VirtualScrollComponent.prototype.applyFixedWidth;

  @Input() item!: T;

  @Input() index!: number;

  private _onDestroy = new Subject<void>();

  protected renderSticky = new BehaviorSubject<EmbeddedViewRef<any> | null>(null);
  public renderedSticky$ = this.renderSticky.pipe(takeUntil(this._onDestroy));

  ngOnInit(): void {
    this.renderRow();
  }

  public rowView?: EmbeddedViewRef<any>;

  /**
   * A shorthand for grabbing the current element's positioning in the DOM, to reduce
   * boilerplate when calculating the sticky shadow in the virtual-scroll.component.ts.
   */
  public get rowViewDimensions(): DOMRect {
    return (this.rowView?.rootNodes[0]).getBoundingClientRect() as DOMRect;
  }

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
      this.cellPadding,
      this.mappedActiveColumns$,
      this.moveItem,
      this.item,
      this.index,
      this.renderSticky,
      this.applyStickyShadow,
      this.removeCellWidths$,
      this.applyFixedWidths$,
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
