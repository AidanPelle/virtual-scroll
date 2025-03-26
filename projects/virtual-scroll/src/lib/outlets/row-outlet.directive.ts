import { Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { CellOutletDirective } from "./cell-outlet.directive";
import { ColumnManager } from "../column-manager/column-manager";
import type { VirtualScrollComponent } from "../virtual-scroll/virtual-scroll.component";   // Using type instead of direct import to fix circular import references

@Directive({
  selector: '[rowOutlet]',
})
export class RowOutletDirective<T> implements OnInit, OnDestroy {

  private _viewContainer = inject(ViewContainerRef);
  private _columnManager?: ColumnManager<T>;

  @Input() rowTemplate?: TemplateRef<any>;

  @Input() defaultRowTemplate!: TemplateRef<any>;

  @Input() cellPadding!: number;

  @Input() mappedActiveColumns$!: typeof VirtualScrollComponent.prototype.mappedActiveColumns$;

  @Input() moveItem!: typeof VirtualScrollComponent.prototype.moveItem;

  @Input() item!: T;

  @Input() index!: number;

  constructor() { }

  ngOnInit(): void {
    this.renderRow();
  }

  renderRow(): void {
    // Remove any currently rendered items from the view
    this._viewContainer.clear();

    // When there's no template provided from the user, we can substitute with some default template
    const rowView = this._viewContainer.createEmbeddedView(this.rowTemplate ?? this.defaultRowTemplate);

    const cellOutlet = CellOutletDirective.mostRecentView;
    if (!cellOutlet)
      throw Error('No vs-row detected on rowDef, cannot render cells');


    rowView.rootNodes[0].classList.add('vs-row');
    rowView.rootNodes[0].classList.add('vs-row-border');

    this._columnManager?.onDestroy();
    this._columnManager = new ColumnManager(cellOutlet.viewContainer, this.cellPadding, this.mappedActiveColumns$, this.moveItem, this.item, this.index);
  }

  ngOnDestroy(): void {
    this._columnManager?.onDestroy();
  }

}
