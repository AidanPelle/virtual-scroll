import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatedDemoComponent } from './paginated-demo.component';

describe('PaginatedDemoComponent', () => {
  let component: PaginatedDemoComponent;
  let fixture: ComponentFixture<PaginatedDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginatedDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginatedDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
