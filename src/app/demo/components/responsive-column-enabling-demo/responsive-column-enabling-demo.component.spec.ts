import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveColumnEnablingDemoComponent } from './responsive-column-enabling-demo.component';

describe('ResponsiveColumnEnablingDemoComponent', () => {
  let component: ResponsiveColumnEnablingDemoComponent;
  let fixture: ComponentFixture<ResponsiveColumnEnablingDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponsiveColumnEnablingDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsiveColumnEnablingDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
