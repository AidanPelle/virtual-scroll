import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicContainerDemoComponent } from './dynamic-container-demo.component';

describe('DynamicContainerDemoComponent', () => {
  let component: DynamicContainerDemoComponent;
  let fixture: ComponentFixture<DynamicContainerDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicContainerDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicContainerDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
