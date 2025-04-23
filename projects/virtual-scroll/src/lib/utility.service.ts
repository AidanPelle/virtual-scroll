import { combineLatestWith, map, Observable, shareReplay } from 'rxjs';
import type { CellDefDirective } from './defs/cell-def.directive';
import { EmbeddedViewRef } from '@angular/core';

export class UtilityService {

  static mapRowBufferToPx(rowBuffer: Observable<number>, itemSize: Observable<number>) {
    return rowBuffer.pipe(
      combineLatestWith(itemSize),
      map(([rowBuffer, itemSize]) => {
        return rowBuffer * itemSize;
      }),
      shareReplay(1),
    );
  }

  static applyCellStyling(cell: CellDefDirective, cellView: EmbeddedViewRef<any>, cellPadding: number) {
    const rootElement = cellView.rootNodes[0];
    rootElement.classList.add('vs-cell');
    UtilityService.applyHorizontalPadding(rootElement, cellPadding);
    UtilityService.applyAlignment(rootElement, cell.align);

    // When fixedWidth is applied, it overrides flex, minWidth, and maxWidth so that the cell width will always remain static.
    // As a result, we can skip the flex, minWidth and maxWidth style applications.
    if (cell.fixedWidth != null) {
      UtilityService.applyFixedWidth(rootElement, cell.fixedWidth);
      return;
    }

    UtilityService.applyFlex(rootElement, cell.flex);
    UtilityService.applyMinWidth(rootElement, cell.minWidth);
    UtilityService.applyMaxWidth(rootElement, cell.maxWidth);
  }

  private static applyHorizontalPadding(rootElement: any, cellPadding: number) {
    if (cellPadding == null || cellPadding == 0)
      return;

    rootElement.style.paddingLeft = cellPadding + 'px';
    rootElement.style.paddingRight = cellPadding + 'px';
  }

  private static applyAlignment(rootElement: any, alignment: typeof CellDefDirective.prototype.align) {
    // When alignment is "start", we don't need to actually apply it, since that's the default behavior for display flex.
    if (alignment == null)
      return;

    rootElement.style.display = 'flex';
    rootElement.style.justifyContent = alignment;
  }

  private static applyFlex(rootElement: any, flex: typeof CellDefDirective.prototype.flex) {
    // Flex 1 is applied by default, so we don't need to add a custom style in that case
    if (flex === 1)
      return;

    rootElement.style.flex = flex;
  }

  private static applyMinWidth(rootElement: any, minWidth: typeof CellDefDirective.prototype.minWidth) {
    // Default for minWidth is 32px, so when that hasn't changed, we don't need to apply the styling
    if (minWidth === 32)
      return;

    rootElement.style.minWidth = minWidth + 'px';
  }

  private static applyMaxWidth(rootElement: any, maxWidth: typeof CellDefDirective.prototype.maxWidth) {
    // Default for minWidth is null, so when that hasn't changed, we don't need to apply the styling
    if (maxWidth == null)
      return;

    rootElement.style.maxWidth = maxWidth + 'px';
  }

  public static applyFixedWidth(rootElement: any, fixedWidth: number) {
    rootElement.style.width = fixedWidth + 'px';
    rootElement.style.minWidth = fixedWidth + 'px';
    rootElement.style.maxWidth = fixedWidth + 'px';
  }

  public static removeCellWidths(rootElement: any) {
    rootElement.style.flex = null;
    rootElement.style.minWidth = null;
    rootElement.style.maxWidth = null;
}
}
