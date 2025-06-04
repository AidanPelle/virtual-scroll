import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { Component } from '@angular/core';
import { MatSortModule, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-sort-example',
  templateUrl: './sort-example.component.html',
  styleUrl: './sort-example.component.scss',
    standalone: true,
    imports: [VirtualScrollModule, MatSortModule],
})
export class SortExampleComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }

  sortList(sort: Sort) {
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      let result = 0;
      if (a > b)
        result = 1;
      else if (a < b)
        result = -1;
      if (sort.direction == 'desc')
        result *= -1;
      return result;
    });
  }
}
