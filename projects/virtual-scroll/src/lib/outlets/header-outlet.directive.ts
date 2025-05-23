import { Directive, Input, TemplateRef } from '@angular/core';
import { RowOutletDirective } from './row-outlet.directive';
import { HeaderCellDefDirective } from '../defs/header-cell-def.directive';
import { ColumnManager } from '../column-manager/column-manager';
import { CellOutletDirective } from './cell-outlet.directive';

@Directive({
  selector: '[headerOutlet]',
})
export class HeaderOutletDirective<T> extends RowOutletDirective<T> {

  /** A reference to any user-provided header cell definitions, that can be used in place of the default. */
  @Input() headerCellDefs!: HeaderCellDefDirective[];

  /** The default template for a header cell. Will render the name of the cell, nothing more. */
  @Input() defaultHeaderCellTemplate!: TemplateRef<unknown>;

  override ngOnInit(): void {
    this.renderRow();
  }

  protected override initColumnManager(cellOutlet: CellOutletDirective): void {
    this._columnManager = new ColumnManager(
      cellOutlet.viewContainer,
      this.virtualScroll,
      this.item,
      this.index,
      this.renderSticky,
      this.sliderTemplate,
      true,
      this.headerCellDefs,
      this.defaultHeaderCellTemplate,
    );
  }
}
