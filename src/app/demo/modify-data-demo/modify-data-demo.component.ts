import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CustomDataSource, VirtualScrollModule } from '../../../../projects/virtual-scroll/src/public-api';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modify-list-data-demo',
  templateUrl: './modify-data-demo.component.html',
  styleUrl: './modify-data-demo.component.scss',
  standalone: true,
  imports: [VirtualScrollModule, MatCardModule, MatButtonModule],
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
