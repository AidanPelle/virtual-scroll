import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { Component } from '@angular/core';

@Component({
  selector: 'app-item-size-example',
  templateUrl: './item-size-example.component.html',
  styleUrl: './item-size-example.component.scss',
  standalone: true,
  imports: [VirtualScrollModule],
})
export class ItemSizeExampleComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
