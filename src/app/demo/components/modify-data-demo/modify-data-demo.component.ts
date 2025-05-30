import { Component } from '@angular/core';
import { CustomDataSource, VirtualScrollModule } from 'virtual-scroll';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modify-data-demo',
  templateUrl: './modify-data-demo.component.html',
  styleUrl: './modify-data-demo.component.scss',
  standalone: true,
  imports: [VirtualScrollModule, MatButtonModule],
})
export class ModifyDataDemoComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 5}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }

  appendItem() {
    this.dataSource.data.push('New Item!');
  }

  removeFirstItem() {
    this.dataSource.data.shift();
  }
}
