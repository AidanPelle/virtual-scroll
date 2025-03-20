import { Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { CellDefDirective } from "../defs/cell-def.directive";
import { CellOutletDirective } from "./cell-outlet.directive";
import { UtilityService } from "../utility.service";
import { ColumnManager } from "../column-manager/column-manager";

@Directive({
  selector: '[rowOutlet]',
})
export class RowOutletDirective implements OnInit, OnDestroy {

  private _viewContainer = inject(ViewContainerRef);
  private _columnManager?: ColumnManager;

  @Input() rowTemplate?: TemplateRef<any>;

  @Input() defaultRowTemplate!: TemplateRef<any>;

  @Input() cellDefs: CellDefDirective[] = [];

  @Input() cellPadding!: number;

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
    this._columnManager = new ColumnManager(this.cellDefs, cellOutlet.viewContainer, this.cellPadding);
  }

  ngOnDestroy(): void {
    this._columnManager?.onDestroy();
  }

}
