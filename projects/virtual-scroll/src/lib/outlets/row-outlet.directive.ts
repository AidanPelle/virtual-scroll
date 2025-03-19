import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { CellDefDirective } from "../defs/cell-def.directive";
import { CellOutletDirective } from "./cell-outlet.directive";
import { UtilityService } from "../utility.service";

@Directive({
  selector: '[rowOutlet]',
})
export class RowOutletDirective implements OnInit {

  private _viewContainer = inject(ViewContainerRef);

  @Input() rowTemplate?: TemplateRef<any>;

  @Input() defaultRowTemplate!: TemplateRef<any>;

  @Input() cellDefs?: CellDefDirective[] = [];

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

    this.renderCells(cellOutlet);
  }

  renderCells(cellOutlet: CellOutletDirective): void {
    this.cellDefs?.forEach(cellDef => {
      const cellView = cellOutlet.viewContainer.createEmbeddedView(cellDef.template);
      UtilityService.applyCellStyling(cellDef, cellView, this.cellPadding);
    });
  }

}
