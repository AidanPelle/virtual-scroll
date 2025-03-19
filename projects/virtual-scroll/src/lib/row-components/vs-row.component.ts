import { Component } from '@angular/core';

@Component({
  selector: 'vs-row, [vs-row]',
  template: `
    <ng-content select="[before]"></ng-content>
    <!-- CellOutletDirective is where the cells for a row will be injected during runtime -->
    <ng-container cellOutlet></ng-container>
    <ng-content select="[after]"></ng-content>
  `,
})
export class VsRowComponent {

}
