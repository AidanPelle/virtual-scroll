import { Directive, Input, TemplateRef } from '@angular/core';

/**
 * This directive is used to handle when a developer needs a custom
 * header for their column, rather than the default provided. All
 * preset stylings will still be handled at the cell-level, so that
 * we don't have inconsistent stylings between the header and the rows.
 */
@Directive({
  selector: '[headerCellDef]'
})
export class HeaderCellDefDirective {

  /**
   * The name of the column for the header cell.
   * 
   * If this value does not find an exact match to at least one cellDef,
   * this header cell will not be rendered.
   */
  @Input('headerCellDefName') columnName: string = '';

  constructor(
    public template: TemplateRef<any>,
  ) { }

}
