import { Component } from '@angular/core';
import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';

@Component({
  selector: 'app-resizable-demo',
  templateUrl: './resizable-demo.component.html',
  styleUrl: './resizable-demo.component.scss',
  standalone: true,
  imports: [VirtualScrollModule],
})
export class ResizableDemoComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
