import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[cellDef]',
})
export class CellDefDirective {

  public template = inject(TemplateRef);

}
