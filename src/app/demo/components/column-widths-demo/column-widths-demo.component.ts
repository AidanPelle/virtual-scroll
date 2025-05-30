import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CustomDataSource, VirtualScrollModule } from 'virtual-scroll';

@Component({
  selector: 'app-column-widths-demo',
  templateUrl: './column-widths-demo.component.html',
  styleUrl: './column-widths-demo.component.scss',
  standalone: true,
  imports: [
    VirtualScrollModule,
    MatCardModule,
  ]
})
export class ColumnWidthsDemoComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
