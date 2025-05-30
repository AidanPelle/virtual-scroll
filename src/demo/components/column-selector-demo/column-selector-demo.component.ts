import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomDataSource, VirtualScrollModule } from 'virtual-scroll';

@Component({
  selector: 'app-column-selector-demo',
  templateUrl: './column-selector-demo.component.html',
  styleUrl: './column-selector-demo.component.scss',
  standalone: true,
  imports: [
    VirtualScrollModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class ColumnSelectorDemoComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
