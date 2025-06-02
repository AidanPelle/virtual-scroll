import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { Component } from '@angular/core';

@Component({
  selector: 'app-static-height-example',
  templateUrl: './static-height-example.component.html',
  styleUrl: './static-height-example.component.scss',
  standalone: true,
  imports: [VirtualScrollModule],
})
export class StaticHeightExampleComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
