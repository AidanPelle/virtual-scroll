import { TestBed } from '@angular/core/testing';

import { UtilityService } from './utility.service';
import { CellDefDirective, VirtualScrollModule } from '../public-api';
import { Component, ViewChild } from '@angular/core';
import { firstValueFrom, lastValueFrom, of } from 'rxjs';

describe('UtilityService', () => {
  let cellDef: CellDefDirective;
  let div: HTMLElement;
  const cellPadding = 16;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        VirtualScrollModule,
      ],
      declarations: [
        CellDefDirectiveTest,
      ],
    }).compileComponents();

    div = document.createElement("div");
    cellDef = TestBed.createComponent(CellDefDirectiveTest).componentInstance.cellDef;
  });

  afterEach(() => {
    div.remove();
  });

  it('should be created', () => {
    expect(UtilityService).toBeTruthy();
  });

  it('should calculate total item size', async () => {
    const obs = UtilityService.mapRowBufferToPx(of(10), of(48));
    const totalSize = await firstValueFrom(obs);

    expect(totalSize).toEqual(480);
  });

  it('should have fixedWidth', () => {
    const fixedWidth = 50;
    cellDef.originalFixedWidth = fixedWidth;
    UtilityService.applyCellStyling(cellDef, div, cellPadding);

    expect(div.style.minWidth).toEqual(fixedWidth + 'px');
    expect(div.style.width).toEqual(fixedWidth + 'px');
    expect(div.style.maxWidth).toEqual(fixedWidth + 'px');
  });

  it('should have minWidth', () => {
    const minWidth = 50;
    cellDef.minWidth = minWidth;
    UtilityService.applyCellStyling(cellDef, div, cellPadding);
    
    expect(div.style.minWidth).toEqual(minWidth + 'px');
    expect(div.style.width).toEqual('');
    expect(div.style.maxWidth).toEqual('');
  });
});

@Component({
  template: `
    <virtual-scroll>
      <div *cellDef="let item; name: 'Dummy Cell';">Cell 5</div>
    </virtual-scroll>
  `,
})
class CellDefDirectiveTest {
  @ViewChild(CellDefDirective, {static: true}) cellDef!: CellDefDirective;
}