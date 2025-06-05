import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomHeaderCellExampleComponent } from './custom-header-cell-example.component';

describe('CustomHeaderCellExampleComponent', () => {
  let component: CustomHeaderCellExampleComponent;
  let fixture: ComponentFixture<CustomHeaderCellExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomHeaderCellExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomHeaderCellExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
