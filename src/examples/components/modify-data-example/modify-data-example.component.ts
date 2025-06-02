import { Component } from '@angular/core';
import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modify-data-example',
  templateUrl: './modify-data-example.component.html',
  styleUrl: './modify-data-example.component.scss',
  standalone: true,
  imports: [VirtualScrollModule, MatButtonModule],
})
export class ModifyDataExampleComponent {
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
