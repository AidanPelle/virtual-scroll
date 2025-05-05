import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnSelectorDialogComponent } from './column-selector-dialog.component';
import { VirtualScrollComponent } from '../virtual-scroll/virtual-scroll.component';
import { VirtualScrollModule } from '../virtual-scroll.module';

describe('ColumnSelectorDialogComponent', () => {
  let component: ColumnSelectorDialogComponent<unknown>;
  let fixture: ComponentFixture<ColumnSelectorDialogComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualScrollModule],
    })
    .compileComponents();

    const virtualScroll = TestBed.createComponent(VirtualScrollComponent).componentInstance;
    fixture = TestBed.createComponent(ColumnSelectorDialogComponent);
    component = fixture.componentInstance;
    component.virtualScroll = virtualScroll;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
