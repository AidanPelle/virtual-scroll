import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';

@Component({
  selector: 'app-column-selector-example',
  templateUrl: './column-selector-example.component.html',
  styleUrl: './column-selector-example.component.scss',
  standalone: true,
  imports: [
    VirtualScrollModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class ColumnSelectorExampleComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
