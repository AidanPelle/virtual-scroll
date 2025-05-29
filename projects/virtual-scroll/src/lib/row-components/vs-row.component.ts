import { Component } from '@angular/core';

/**
 * This component primarily gives us access to a CellOutletDirective,
 * so that we have a place to inject colums into.
 */
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
