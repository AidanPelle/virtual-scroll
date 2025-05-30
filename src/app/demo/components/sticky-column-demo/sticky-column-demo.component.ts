import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CustomDataSource, VirtualScrollModule } from 'virtual-scroll';

@Component({
  selector: 'app-sticky-column-demo',
  templateUrl: './sticky-column-demo.component.html',
  styleUrl: './sticky-column-demo.component.scss',
  standalone: true,
  imports: [VirtualScrollModule, MatCardModule],
})
export class StickyColumnDemoComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
