import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualScrollComponent } from './virtual-scroll.component';
import { VirtualScrollModule } from '../virtual-scroll.module';

describe('VirtualScrollComponent', () => {
  let component: VirtualScrollComponent<unknown>;
  let fixture: ComponentFixture<VirtualScrollComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualScrollModule],
      // Don't need to declare virtualScrollComponent since it's exported in VirtualScrollModule
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
