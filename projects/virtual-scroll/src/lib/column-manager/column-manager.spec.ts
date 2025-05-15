import { Component, EmbeddedViewRef, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { VirtualScrollComponent } from '../virtual-scroll/virtual-scroll.component';
import { ColumnManager } from './column-manager';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VirtualScrollModule } from '../virtual-scroll.module';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { CellContext } from '../interfaces/cell-context';
import { By } from '@angular/platform-browser';

describe('VsRowComponent', () => {
  let manager: ColumnManager<unknown>;
  let virtualScroll: VirtualScrollComponent<unknown>;
  let fixture: ComponentFixture<ColumnManagerTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualScrollModule],
      declarations: [ColumnManagerTest],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColumnManagerTest);
    const instance = fixture.componentInstance;
    fixture.detectChanges();

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

  it('should remove widths', () => {
    const renderedElement = manager.renderedCellViews.find(c => c.columnName === 'Min Width Cell')?.view.rootNodes[0] as HTMLElement;
    expect(renderedElement.style.minWidth).toEqual('50px');
    virtualScroll.removeCellWidths.next('Min Width Cell');
    expect(renderedElement.style.minWidth).toEqual('');
  });

  it('should remove the rendered cell', async () => {
    let divs = fixture.debugElement.queryAll(By.css('div'));
    let cell2Element = divs.find(d => (d.nativeElement as HTMLElement).textContent?.includes('Cell 2'));
    expect(cell2Element).toBeTruthy();

    const orderedCellDefs = await firstValueFrom(virtualScroll.orderedCellDefs$);
    const cellDef2 = orderedCellDefs.find(o => o.columnName === 'Cell 2');
    cellDef2?.userDefinedActiveState.next(false);

    divs = fixture.debugElement.queryAll(By.css('div'));
    cell2Element = divs.find(d => (d.nativeElement as HTMLElement).textContent?.includes('Cell 2'));
    expect(cell2Element).toBeFalsy();
  });

  it('should move the cell', async () => {
    // virtualScroll = 
    // let cell2Element = divs.find(d => (d.nativeElement as HTMLElement).textContent?.includes('Cell 2'));
  });
});

@Component({
  template: `
    <virtual-scroll>
      <div *cellDef="let item; name: 'Cell 1';">Cell 1</div>
      <div *cellDef="let item; name: 'Cell 2';">Cell 2</div>
      <div *cellDef="let item; name: 'Cell 3'; isActive: false;">Cell 3</div>
      <div *cellDef="let item; name: 'Min Width Cell'; minWidth: 50;">Min Width Cell</div>
    </virtual-scroll>

    <ng-container #viewContainer></ng-container>
    
    <ng-template #sliderTemplate>
      <div style="min-width: 8px; max-width: 8px; height: 100%; box-sizing: border-box;"></div>
    </ng-template>
  `,
})
class ColumnManagerTest {
  @ViewChild(VirtualScrollComponent, {static: true}) virtualScroll!: VirtualScrollComponent<unknown>;
  @ViewChild('viewContainer', {static: true, read: ViewContainerRef}) viewContainer!: ViewContainerRef;
  @ViewChild('sliderTemplate', {static: true, read: TemplateRef<unknown>}) sliderTemplate!: TemplateRef<unknown>;
}
