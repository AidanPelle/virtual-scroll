import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { Component } from '@angular/core';

@Component({
  selector: 'app-filtering-example',
  templateUrl: './filtering-example.component.html',
  styleUrl: './filtering-example.component.scss',
    standalone: true,
    imports: [VirtualScrollModule],
})
export class FilteringExampleComponent {
  originalList: string[] = [];
  protected dataSource = this.initSource();

  initSource() {
    this.originalList = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(JSON.parse(JSON.stringify(this.originalList)));
  }

  filterList(filter: string) {
    this.dataSource.data = this.originalList.filter(value => {
      return value.toLowerCase().includes(filter.toLowerCase());
    });
  }
}
