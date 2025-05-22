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
  
  /** A reference to the related scrolling component, for which this dialog will manage column state. */
  public virtualScroll!: VirtualScrollComponent<T>;

  /** Handles re-arranging a column in the list of columns for the virtual scroll component. */
  drop(event: CdkDragDrop<unknown, unknown, CellDefDirective>, activeState: Observable<boolean>) {
    activeState.pipe(take(1)).subscribe(isActive => {
      this.virtualScroll.moveColumn.next({fromIndex: event.previousIndex, toIndex: event.currentIndex, isActive: isActive});
    });
  }
}
