import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnWidthsDemoComponent } from './column-widths-demo.component';

describe('ColumnWidthsDemoComponent', () => {
  let component: ColumnWidthsDemoComponent;
  let fixture: ComponentFixture<ColumnWidthsDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColumnWidthsDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnWidthsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
