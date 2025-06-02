import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { Component } from '@angular/core';

@Component({
  selector: 'app-resize-width-example',
  templateUrl: './resize-width-example.component.html',
  styleUrl: './resize-width-example.component.scss',
  standalone: true,
  imports: [VirtualScrollModule],
})
export class ResizeWidthExampleComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
