import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnSelectorDemoComponent } from './column-selector-demo.component';

describe('ColumnSelectorDemoComponent', () => {
  let component: ColumnSelectorDemoComponent;
  let fixture: ComponentFixture<ColumnSelectorDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColumnSelectorDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnSelectorDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
