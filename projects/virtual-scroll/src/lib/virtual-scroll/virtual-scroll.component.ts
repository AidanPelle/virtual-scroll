import { Component, Input } from '@angular/core';

@Component({
  selector: 'virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrl: './virtual-scroll.component.scss'
})
export class VirtualScrollComponent {

  @Input() itemSize: number = 48;
}
