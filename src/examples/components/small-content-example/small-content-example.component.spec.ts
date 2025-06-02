import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallContentExampleComponent } from './small-content-example.component';

describe('SmallContentExampleComponent', () => {
  let component: SmallContentExampleComponent;
  let fixture: ComponentFixture<SmallContentExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmallContentExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallContentExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
