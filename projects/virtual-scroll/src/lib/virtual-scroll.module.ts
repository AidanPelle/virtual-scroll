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



@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    OverlayModule,
  ],
  declarations: [
    VirtualScrollComponent,
    RowOutletDirective,
    RowDefDirective,
    VsRowComponent,
    CellOutletDirective,
    CellDefDirective,
    ColumnSelectorDialogComponent,
    ColumnSelectorDirective,
  ],
  exports: [
    VirtualScrollComponent,
    RowDefDirective,
    VsRowComponent,
    CellDefDirective,
    ColumnSelectorDirective,
  ]
})
export class VirtualScrollModule { }
