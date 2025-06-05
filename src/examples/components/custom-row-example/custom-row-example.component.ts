import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-row-example',
  templateUrl: './custom-row-example.component.html',
  styleUrl: './custom-row-example.component.scss',
  standalone: true,
  imports: [VirtualScrollModule],
})
export class CustomRowExampleComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
