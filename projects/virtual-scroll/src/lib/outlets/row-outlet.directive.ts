import { Directive, inject, Input, OnInit, QueryList, TemplateRef, ViewContainerRef } from '@angular/core';
import { CellOutletDirective } from './cell-outlet.directive';
import { CellDefDirective } from '../defs/cell-def.directive';

@Directive({
  selector: '[rowOutlet]',
})
export class RowOutletDirective implements OnInit {

  private _viewContainer = inject(ViewContainerRef);

  @Input() rowTemplate?: TemplateRef<any>;

  @Input() defaultRowTemplate!: TemplateRef<any>;

  @Input() cellDefs?: CellDefDirective[] = [];

  constructor() { }

  ngOnInit(): void {
    this._viewContainer.createEmbeddedView(this.rowTemplate ?? this.defaultRowTemplate);

    if (!CellOutletDirective.mostRecentView)
      throw Error("No vs-row detected on rowDef, cannot render cells");

    const cellOutlet = CellOutletDirective.mostRecentView;

    this.cellDefs?.forEach(cellDef => {
      cellOutlet.viewContainer.createEmbeddedView(cellDef.template);
    });
  }

}
