import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VsRowComponent } from './vs-row.component';

describe('VsRowComponent', () => {
  let component: VsRowComponent;
  let fixture: ComponentFixture<VsRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VsRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VsRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
