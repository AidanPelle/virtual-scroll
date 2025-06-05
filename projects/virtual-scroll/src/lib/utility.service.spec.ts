import { TestBed } from '@angular/core/testing';

import { UtilityService } from './utility.service';
import { CellDefDirective, VirtualScrollModule } from '../public-api';
import { Component, ViewChild } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';

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
    const numRowsToBuffer = 10;
    const itemHeight = 48;
    const obs = UtilityService.mapRowBufferToPx(of(numRowsToBuffer), of(itemHeight));
    const totalSize = await firstValueFrom(obs);

    expect(totalSize).toEqual(numRowsToBuffer * itemHeight);
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

  it('should have maxWidth', () => {
    const maxWidth = 50;
    cellDef.maxWidth = maxWidth;
    UtilityService.applyCellStyling(cellDef, div, cellPadding);
    
    expect(div.style.maxWidth).toEqual(maxWidth + 'px');
    expect(div.style.width).toEqual('');
    expect(div.style.minWidth).toEqual('');
  });

  it('should not have cell padding from 0', () => {
    UtilityService.applyCellStyling(cellDef, div, 0);
    expect(div.style.paddingLeft).toEqual('');
    expect(div.style.paddingRight).toEqual('');
  });

  it('should not have cell padding from null', () => {
    UtilityService.applyCellStyling(cellDef, div, 0);
    expect(div.style.paddingLeft).toEqual('');
    expect(div.style.paddingRight).toEqual('');
  });

  it('should be aligned center', () => {
    cellDef.align = "center";
    UtilityService.applyCellStyling(cellDef, div, cellPadding);
    expect(div.style.display).toEqual("flex");
    expect(div.style.justifyContent).toEqual("center");
  });

  it('should be aligned end', () => {
    cellDef.align = "end";
    UtilityService.applyCellStyling(cellDef, div, cellPadding);
    expect(div.style.display).toEqual("flex");
    expect(div.style.justifyContent).toEqual("flex-end");
  });

  it('should not have flex applied', () => {
    UtilityService.applyCellStyling(cellDef, div, cellPadding);
    expect(div.style.flex).toEqual("");
  });

  it('should be flex 2', () => {
    cellDef.flex = 2;
    UtilityService.applyCellStyling(cellDef, div, cellPadding);
    expect(div.style.flex).toEqual("2");
  });

  it('should remove applied widths', () => {
    const fixedWidth = 50;
    cellDef.originalFixedWidth = fixedWidth;
    UtilityService.applyCellStyling(cellDef, div, cellPadding);

    expect(div.style.minWidth).toEqual(fixedWidth + 'px');
    expect(div.style.width).toEqual(fixedWidth + 'px');
    expect(div.style.maxWidth).toEqual(fixedWidth + 'px');

    UtilityService.removeCellWidths(div);
    expect(div.style.minWidth).toEqual('');
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