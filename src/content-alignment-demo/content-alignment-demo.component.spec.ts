import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentAlignmentDemoComponent } from './content-alignment-demo.component';

describe('ContentAlignmentDemoComponent', () => {
  let component: ContentAlignmentDemoComponent;
  let fixture: ComponentFixture<ContentAlignmentDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentAlignmentDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentAlignmentDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
