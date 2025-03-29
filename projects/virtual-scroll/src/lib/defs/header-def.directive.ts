import { Directive } from '@angular/core';
import { RowDefDirective } from 'virtual-scroll';

@Directive({
  selector: '[headerDef]',
})
export class HeaderDefDirective extends RowDefDirective {

}
