import { Component } from '@angular/core';
import { CustomDataSource, VirtualScrollModule } from '../../../../projects/virtual-scroll/src/public-api';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-content-alignment-demo',
  templateUrl: './content-alignment-demo.component.html',
  styleUrl: './content-alignment-demo.component.scss',
  standalone: true,
  imports: [VirtualScrollModule, MatCardModule],
})
export class ContentAlignmentDemoComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 400_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
