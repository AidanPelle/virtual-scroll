import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-header-cell-example',
  templateUrl: './custom-header-cell-example.component.html',
  styleUrl: './custom-header-cell-example.component.scss',
    standalone: true,
    imports: [VirtualScrollModule],
})
export class CustomHeaderCellExampleComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
