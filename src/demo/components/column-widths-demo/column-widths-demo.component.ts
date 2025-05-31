import { Component } from '@angular/core';
import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';

@Component({
  selector: 'app-column-widths-demo',
  templateUrl: './column-widths-demo.component.html',
  styleUrl: './column-widths-demo.component.scss',
  standalone: true,
  imports: [
    VirtualScrollModule,
  ]
})
export class ColumnWidthsDemoComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
