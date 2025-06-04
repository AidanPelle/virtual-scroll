import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { Component } from '@angular/core';

@Component({
  selector: 'app-min-max-widths-example',
  templateUrl: './min-max-widths-example.component.html',
  styleUrl: './min-max-widths-example.component.scss',
    standalone: true,
    imports: [VirtualScrollModule],
})
export class MinMaxWidthsExampleComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
