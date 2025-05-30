import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyListDataDemoComponent } from './modify-list-data-demo.component';

describe('ModifyListDataDemoComponent', () => {
  let component: ModifyListDataDemoComponent;
  let fixture: ComponentFixture<ModifyListDataDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyListDataDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyListDataDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
