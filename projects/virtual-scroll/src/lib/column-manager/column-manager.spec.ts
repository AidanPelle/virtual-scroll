import { Component, EmbeddedViewRef, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { VirtualScrollComponent } from '../virtual-scroll/virtual-scroll.component';
import { ColumnManager } from './column-manager';
import { TestBed } from '@angular/core/testing';
import { VirtualScrollModule } from '../virtual-scroll.module';
import { BehaviorSubject, delay, firstValueFrom, of } from 'rxjs';
import { CellContext } from '../interfaces/cell-context';
import { UtilityService } from '../utility.service';

describe('VsRowComponent', () => {
  let manager: ColumnManager<unknown>;
  let virtualScroll: VirtualScrollComponent<unknown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualScrollModule],
      declarations: [ColumnManagerTest],
    })
    .compileComponents();
    
    const virtualScrollFixture = TestBed.createComponent(ColumnManagerTest);
    const instance = virtualScrollFixture.componentInstance;
    virtualScrollFixture.detectChanges();

    manager = new ColumnManager(
        instance.viewContainer,
        instance.virtualScroll,
        null,
        5,
        new BehaviorSubject<EmbeddedViewRef<CellContext<unknown>> | null>(null),
        instance.sliderTemplate,
        false,
        [],
        undefined
    );
    virtualScroll = instance.virtualScroll;
  });

  it('should create', () => {
    expect(manager).toBeTruthy();
  });

});

@Component({
  template: `
    <virtual-scroll>
      <div *cellDef="let item; name: 'Cell 1';">Cell 1</div>
      <div *cellDef="let item; name: 'Cell 2';">Cell 2</div>
      <div *cellDef="let item; name: 'Cell 3'; isActive: false;">Cell 3</div>
      <div *cellDef="let item; name: 'Min Width Cell'; minWidth: 50;">Cell 3</div>
    </virtual-scroll>

    <ng-container #viewContainer></ng-container>
  `,
})
class ColumnManagerTest {
  @ViewChild(VirtualScrollComponent, {static: true}) virtualScroll!: VirtualScrollComponent<unknown>;
  @ViewChild('viewContainer', {static: true, read: ViewContainerRef}) viewContainer!: ViewContainerRef;
  @ViewChild('sliderTemplate', {static: true, read: TemplateRef<unknown>}) sliderTemplate!: TemplateRef<unknown>;
}
