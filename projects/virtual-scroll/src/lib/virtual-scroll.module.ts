import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualScrollComponent } from './virtual-scroll/virtual-scroll.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RowOutletDirective } from './outlets/row-outlet.directive';
import { RowDefDirective } from './defs/row-def.directive';



@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
  ],
  declarations: [
    VirtualScrollComponent,
    RowOutletDirective,
    RowDefDirective,
  ],
  exports: [
    VirtualScrollComponent,
    RowDefDirective,
  ]
})
export class VirtualScrollModule { }
