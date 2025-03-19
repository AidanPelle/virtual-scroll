import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualScrollComponent } from './virtual-scroll/virtual-scroll.component';
import { ScrollingModule } from '@angular/cdk/scrolling';



@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
  ],
  declarations: [
    VirtualScrollComponent,
  ],
  exports: [
    VirtualScrollComponent,
  ]
})
export class VirtualScrollModule { }
