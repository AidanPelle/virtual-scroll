import { Component } from '@angular/core';
import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';

@Component({
  selector: 'app-dynamic-height-demo',
  templateUrl: './dynamic-height-demo.component.html',
  styleUrl: './dynamic-height-demo.component.scss',
  standalone: true,
  imports: [VirtualScrollModule],
})
export class DynamicHeightDemoComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
