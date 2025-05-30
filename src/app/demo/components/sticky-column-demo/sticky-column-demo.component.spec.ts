import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyColumnDemoComponent } from './sticky-column-demo.component';

describe('StickyColumnDemoComponent', () => {
  let component: StickyColumnDemoComponent;
  let fixture: ComponentFixture<StickyColumnDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StickyColumnDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StickyColumnDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
