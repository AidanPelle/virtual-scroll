import { Component, inject, ViewEncapsulation } from '@angular/core';
import { VirtualScrollComponent } from '../virtual-scroll/virtual-scroll.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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

  drop(event: CdkDragDrop<any, any, any>) {
    this.virtualScroll.moveItem.next({fromIndex: event.previousIndex, toIndex: event.currentIndex});
  }
}
