import { Directive } from '@angular/core';
import { RowDefDirective } from './row-def.directive';

@Directive({
  selector: '[headerDef]',
})
export class HeaderDefDirective extends RowDefDirective {

}
