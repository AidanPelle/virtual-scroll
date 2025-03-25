import { Component, inject, ViewEncapsulation } from '@angular/core';
import { VirtualScrollComponent } from '../virtual-scroll/virtual-scroll.component';

@Component({
  selector: 'column-selector-dialog',
  templateUrl: './column-selector-dialog.component.html',
  styleUrl: './column-selector-dialog.component.scss',
})
export class ColumnSelectorDialogComponent {
  public virtualScroll!: VirtualScrollComponent<unknown>;

  logChange(event: any) {
    console.log(event);
  }
}
