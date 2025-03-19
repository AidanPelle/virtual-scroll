import { Directive, inject, TemplateRef, Input } from "@angular/core";

@Directive({
  selector: '[cellDef]',
})
export class CellDefDirective {

  public template = inject(TemplateRef);

  @Input('cellDefName') columnName: string | null = '';

  /**
   * Test
   */
  @Input('cellDefAlign') set align(value: 'start' | 'center' | 'end') {
    this._align = value;
  }
  private _align: 'start' | 'center' | 'end' = 'start';
  public get align(): null | 'center' | 'flex-end' {
    return this._align === 'start' ? null : this._align === 'center' ? this._align : 'flex-end';
  }

  @Input('cellDefFlex') flex: number = 1;

  @Input('cellDefMinWidth') minWidth: number = 32;

  @Input('cellDefMaxWidth') maxWidth: number | null = null;

  @Input('cellDefIsActive') isActive: boolean = true;

  @Input('cellDefIsEnabled') isEnabled: boolean = true;

  @Input('cellDefMinDisplay') minDisplay: number | null = null;

  @Input('cellDefMaxDisplay') maxDisplay: number | null = null;

  @Input('cellDefFixedWidth') fixedWidth: number | null = null;
}
