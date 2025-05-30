import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteListDemoComponent } from './complete-list-demo.component';

describe('CompleteListDemoComponent', () => {
  let component: CompleteListDemoComponent;
  let fixture: ComponentFixture<CompleteListDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteListDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteListDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
