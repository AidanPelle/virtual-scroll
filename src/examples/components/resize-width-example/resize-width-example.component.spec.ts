import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeWidthExampleComponent } from './resize-width-example.component';

describe('ResizeWidthExampleComponent', () => {
  let component: ResizeWidthExampleComponent;
  let fixture: ComponentFixture<ResizeWidthExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResizeWidthExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResizeWidthExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
