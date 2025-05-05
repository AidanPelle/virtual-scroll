import { Component } from '@angular/core';
import { VirtualScrollComponent } from '../virtual-scroll/virtual-scroll.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import type { CellDefDirective } from '../defs/cell-def.directive';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'column-selector-dialog',
  templateUrl: './column-selector-dialog.component.html',
  styleUrl: './column-selector-dialog.component.scss',
})
export class ColumnSelectorDialogComponent<T> {
  public virtualScroll!: VirtualScrollComponent<T>;

  drop(event: CdkDragDrop<unknown, unknown, CellDefDirective>, activeState: Observable<boolean>) {
    activeState.pipe(take(1)).subscribe(isActive => {
      this.virtualScroll.moveItem.next({fromIndex: event.previousIndex, toIndex: event.currentIndex, isActive: isActive});
    });
  }
}
