import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { Component } from '@angular/core';

@Component({
  selector: 'app-row-buffer-example',
  templateUrl: './row-buffer-example.component.html',
  styleUrl: './row-buffer-example.component.scss',
  standalone: true,
  imports: [VirtualScrollModule],
})
export class RowBufferExampleComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
