import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSizeExampleComponent } from './item-size-example.component';

describe('ItemSizeExampleComponent', () => {
  let component: ItemSizeExampleComponent;
  let fixture: ComponentFixture<ItemSizeExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemSizeExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemSizeExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
