import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import { VirtualScrollComponent } from './virtual-scroll/virtual-scroll.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RowOutletDirective } from './outlets/row-outlet.directive';
import { RowDefDirective } from './defs/row-def.directive';
import { VsRowComponent } from './row-components/vs-row.component';
import { CellOutletDirective } from './outlets/cell-outlet.directive';
import { CellDefDirective } from './defs/cell-def.directive';
import { ColumnSelectorDialogComponent } from './column-selector/column-selector-dialog.component';
import { ColumnSelectorDirective } from './column-selector/column-selector.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HeaderOutletDirective } from './outlets/header-outlet.directive';
import { HeaderDefDirective } from './defs/header-def.directive';
import { HeaderCellDefDirective } from './defs/header-cell-def.directive';
import { ResizableDirective } from './resizable/resizable.directive';



@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    OverlayModule,
    DragDropModule,
  ],
  declarations: [
    VirtualScrollComponent,
    RowOutletDirective,
    HeaderOutletDirective,
    RowDefDirective,
    HeaderDefDirective,
    VsRowComponent,
    CellOutletDirective,
    CellDefDirective,
    HeaderCellDefDirective,
    ColumnSelectorDialogComponent,
    ColumnSelectorDirective,
    ResizableDirective,
  ],
  exports: [
    VirtualScrollComponent,
    RowDefDirective,
    HeaderDefDirective,
    VsRowComponent,
    CellDefDirective,
    HeaderCellDefDirective,
    ColumnSelectorDirective,
  ]
})
export class VirtualScrollModule { }
