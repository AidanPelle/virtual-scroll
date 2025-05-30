import { Component } from '@angular/core';
import { CustomDataSource, VirtualScrollModule } from '../../../../../projects/virtual-scroll/src/public-api';
import { MatCardModule } from '@angular/material/card';

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
    const data = Array.from({length: 400_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
