import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowBufferExampleComponent } from './row-buffer-example.component';

describe('RowBufferExampleComponent', () => {
  let component: RowBufferExampleComponent;
  let fixture: ComponentFixture<RowBufferExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RowBufferExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowBufferExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
