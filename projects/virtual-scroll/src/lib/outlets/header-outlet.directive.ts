import { Directive, Input, TemplateRef } from '@angular/core';
import { RowOutletDirective } from './row-outlet.directive';
import { HeaderCellDefDirective } from '../defs/header-cell-def.directive';
import { ColumnManager } from '../column-manager/column-manager';
import { CellOutletDirective } from './cell-outlet.directive';
import { Observable } from 'rxjs';

@Directive({
  selector: '[headerOutlet]',
})
export class HeaderOutletDirective<T> extends RowOutletDirective<T> {

  @Input() headerCellDefs!: HeaderCellDefDirective[];

  @Input() defaultHeaderCellTemplate!: TemplateRef<unknown>;

  @Input() hasVerticalScrollbar$!: Observable<boolean>;

  protected override initColumnManager(cellOutlet: CellOutletDirective): void {
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
      this.sliderTemplate,
      true,
      this.canResize,
      this.headerCellDefs,
      this.defaultHeaderCellTemplate,
    );
  }
}
