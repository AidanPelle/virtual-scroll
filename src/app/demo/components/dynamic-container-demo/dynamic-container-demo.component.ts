import { Component } from '@angular/core';
import { CustomDataSource, VirtualScrollModule } from 'virtual-scroll';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dynamic-container-demo',
  templateUrl: './dynamic-container-demo.component.html',
  styleUrl: './dynamic-container-demo.component.scss',
  standalone: true,
  imports: [VirtualScrollModule, MatCardModule],
})
export class DynamicContainerDemoComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
