import { Component } from '@angular/core';
import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';

@Component({
  selector: 'app-sticky-column-example',
  templateUrl: './sticky-column-example.component.html',
  styleUrl: './sticky-column-example.component.scss',
  standalone: true,
  imports: [VirtualScrollModule],
})
export class StickyColumnExampleComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
