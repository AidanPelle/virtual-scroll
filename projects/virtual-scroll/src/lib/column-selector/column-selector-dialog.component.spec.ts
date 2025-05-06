import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnSelectorDialogComponent } from './column-selector-dialog.component';
import { VirtualScrollComponent } from '../virtual-scroll/virtual-scroll.component';
import { VirtualScrollModule } from '../virtual-scroll.module';
import { Component, ViewChild } from '@angular/core';
import { CellDefDirective } from '../defs/cell-def.directive';
import { firstValueFrom, map, of } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

describe('ColumnSelectorDialogComponent', () => {
  let component: ColumnSelectorDialogComponent<unknown>;
  let fixture: ComponentFixture<ColumnSelectorDialogComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualScrollModule],
      declarations: [VirtualScrollTest],
    })
    .compileComponents();

    const virtualScrollFixture = TestBed.createComponent(VirtualScrollTest);
    const virtualScroll = virtualScrollFixture.componentInstance.virtualScroll;
    virtualScrollFixture.detectChanges();

    fixture = TestBed.createComponent(ColumnSelectorDialogComponent);
    component = fixture.componentInstance;
    component.virtualScroll = virtualScroll;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should re-order the cell defs', async () => {
    const orderedCellNames = await firstValueFrom(component.virtualScroll.orderedCellDefs$.pipe(map(c => c.map(cc => cc.columnName))));

    const event = {
      previousIndex: 0,
      currentIndex: 1,
    } as CdkDragDrop<unknown, unknown, CellDefDirective>;

    component.drop(event, of(true));

    moveItemInArray(orderedCellNames, 0, 1);
    const newOrder = await firstValueFrom(component.virtualScroll.orderedCellDefs$.pipe(map(c => c.map(cc => cc.columnName))));

    expect(orderedCellNames).toEqual(newOrder);
  });
});
@Component({
  template: `
    <virtual-scroll>
      <div *cellDef="let item; name: 'Cell 1';">Cell 1</div>
      <div *cellDef="let item; name: 'Cell 2';">Cell 2</div>
      <div *cellDef="let item; name: 'Cell 3';">Cell 3</div>
    </virtual-scroll>
  `,
})
class VirtualScrollTest {
  @ViewChild(VirtualScrollComponent, {static: true}) virtualScroll!: VirtualScrollComponent<unknown>;
}
