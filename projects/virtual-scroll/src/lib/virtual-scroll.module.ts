import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualScrollComponent } from './virtual-scroll/virtual-scroll.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RowOutletDirective } from './outlets/row-outlet.directive';
import { RowDefDirective } from './defs/row-def.directive';
import { VsRowComponent } from './row-components/vs-row.component';
import { CellOutletDirective } from './outlets/cell-outlet.directive';
import { CellDefDirective } from './defs/cell-def.directive';



@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
  ],
  declarations: [
    VirtualScrollComponent,
    RowOutletDirective,
    RowDefDirective,
    VsRowComponent,
    CellOutletDirective,
    CellDefDirective,
  ],
  exports: [
    VirtualScrollComponent,
    RowDefDirective,
    VsRowComponent,
    CellDefDirective,
  ]
})
export class VirtualScrollModule { }
