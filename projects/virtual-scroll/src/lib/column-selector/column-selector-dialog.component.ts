import { Component, inject, ViewEncapsulation } from '@angular/core';
import { VirtualScrollComponent } from '../virtual-scroll/virtual-scroll.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import type { CellDefDirective } from '../defs/cell-def.directive';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'column-selector-dialog',
  templateUrl: './column-selector-dialog.component.html',
  styleUrl: './column-selector-dialog.component.scss',
})
export class ColumnSelectorDialogComponent {
  public virtualScroll!: VirtualScrollComponent<unknown>;

  drop(event: CdkDragDrop<any, any, CellDefDirective>, activeState: Observable<boolean>) {
    activeState.pipe(take(1)).subscribe(isActive => {
      this.virtualScroll.moveItem.next({fromIndex: event.previousIndex, toIndex: event.currentIndex, isActive: isActive});
    })
  }
}
