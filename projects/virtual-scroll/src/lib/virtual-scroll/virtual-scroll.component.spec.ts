import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualScrollComponent } from './virtual-scroll.component';
import { VirtualScrollModule } from '../virtual-scroll.module';
import { By } from '@angular/platform-browser';
import { CustomDataSource } from '../data-sources/custom-data-source';
import { firstValueFrom } from 'rxjs';
import { Component, ViewChild } from '@angular/core';

describe('VirtualScrollComponent', () => {
  let component: VirtualScrollComponent<number>;
  let fixture: ComponentFixture<VirtualScrollTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualScrollModule],
      declarations: [VirtualScrollTest],
      // Don't need to declare virtualScrollComponent since it's exported in VirtualScrollModule
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualScrollTest);
    component = fixture.componentInstance.virtualScroll;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be loading by default', () => {
    const divs = fixture.debugElement.queryAll(By.css('div'));
    const loadingDiv = divs.find(d => (d.nativeElement as HTMLElement).textContent?.includes("Loading"));
    expect(loadingDiv).toBeTruthy();
  });

  it('should be loading when provided a dataSource plus manual flag', () => {
    component.dataSource = new CustomDataSource([5]);
    component.loading = true;
    fixture.detectChanges();

    const divs = fixture.debugElement.queryAll(By.css('div'));
    const loadingDiv = divs.find(d => (d.nativeElement as HTMLElement).textContent?.includes("Loading"));
    expect(loadingDiv).toBeTruthy();
  });

  it('should not be loading', () => {
    component.dataSource = new CustomDataSource([5]);
    fixture.detectChanges();

    const divs = fixture.debugElement.queryAll(By.css('div'));
    const loadingDiv = divs.find(d => (d.nativeElement as HTMLElement).textContent?.includes("Loading"));
    expect(loadingDiv).toBeFalsy();
  });

  it('should not have a vertical scrollbar', async () => {
    component.dataSource = new CustomDataSource([5]);
    fixture.detectChanges();

    const hasVerticalScrollBar = await firstValueFrom(component._hasVerticalScrollBar$);
    expect(hasVerticalScrollBar).toBeFalsy();
  });

  it('should have a vertical scrollbar', async () => {
    component.dataSource = new CustomDataSource(Array(100).fill(0));
    fixture.detectChanges();

    const hasVerticalScrollBar = await firstValueFrom(component._hasVerticalScrollBar$);
    expect(hasVerticalScrollBar).toBeTruthy();
  });

  it('should coalesce trackByFn with index', () => {
    const trackBy = (_index: number, _item: number) => null;
    component.trackByFn = trackBy;
    expect(component.trackByFn(5, 7)).toEqual(5);
  });

  it('should not apply sticky shadow', async () => {
    const applyStickyShadow = await firstValueFrom(component.applyStickyShadow$);
    expect(applyStickyShadow).toBeFalsy();
  });
});

@Component({
  template: `
  <div style="width: 200px;">
    <virtual-scroll>
      <div *cellDef="let item; name: 'Cell 1';">Cell 1</div>
      <div *cellDef="let item; name: 'Cell 2'; sticky: true;">Cell 2</div>
    </virtual-scroll>
  </div>
  `,
})
class VirtualScrollTest {
  @ViewChild(VirtualScrollComponent, { static: true }) virtualScroll!: VirtualScrollComponent<number>;
}

