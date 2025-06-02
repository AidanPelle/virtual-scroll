import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellPaddingExampleComponent } from './cell-padding-example.component';

describe('CellPaddingExampleComponent', () => {
  let component: CellPaddingExampleComponent;
  let fixture: ComponentFixture<CellPaddingExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CellPaddingExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CellPaddingExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
