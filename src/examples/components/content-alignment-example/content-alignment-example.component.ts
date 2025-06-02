import { Component } from '@angular/core';
import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';

@Component({
  selector: 'app-content-alignment-example',
  templateUrl: './content-alignment-example.component.html',
  styleUrl: './content-alignment-example.component.scss',
  standalone: true,
  imports: [VirtualScrollModule],
})
export class ContentAlignmentExampleComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
