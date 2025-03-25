import { Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { CellOutletDirective } from "./cell-outlet.directive";
import { ColumnManager } from "../column-manager/column-manager";
import { BehaviorSubject, Observable } from "rxjs";
import type { CellDefDirective } from "../defs/cell-def.directive";

@Directive({
  selector: '[rowOutlet]',
})
export class RowOutletDirective<T> implements OnInit, OnDestroy {

  private _viewContainer = inject(ViewContainerRef);
  private _columnManager?: ColumnManager<T>;

  @Input() rowTemplate?: TemplateRef<any>;

  @Input() defaultRowTemplate!: TemplateRef<any>;

  @Input() cellPadding!: number;

  @Input() mappedActiveColumns$!: Observable<Observable<{cellDef: CellDefDirective, baseIndex: number, isActive: boolean}>[]>;

  @Input() moveItem!: BehaviorSubject<{ fromIndex: number, toIndex: number } | null>;

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
    this._columnManager = new ColumnManager(cellOutlet.viewContainer, this.cellPadding, this.mappedActiveColumns$, this.moveItem);
  }

  ngOnDestroy(): void {
    this._columnManager?.onDestroy();
  }

}
