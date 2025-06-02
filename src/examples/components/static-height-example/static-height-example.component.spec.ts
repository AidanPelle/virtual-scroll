import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticHeightExampleComponent } from './static-height-example.component';

describe('StaticHeightExampleComponent', () => {
  let component: StaticHeightExampleComponent;
  let fixture: ComponentFixture<StaticHeightExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaticHeightExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticHeightExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
