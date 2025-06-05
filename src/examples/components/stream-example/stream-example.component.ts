
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSortModule, Sort } from '@angular/material/sort';
import { StreamDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';

@Component({
  selector: 'app-stream-example',
  templateUrl: './stream-example.component.html',
  styleUrl: './stream-example.component.scss',
  standalone: true,
  imports: [VirtualScrollModule, MatSortModule],
})
export class StreamExampleComponent implements OnInit {
  private _data = new Subject<string[]>();
  protected dataSource = new StreamDataSource(this._data);

  ngOnInit(): void {
    
    setTimeout(() => {
      this._data.next(Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`))
    }, 2_000);
  }

  sortList(sort: Sort) {
    const sortedData = this.dataSource.data.sort((a, b) => {
      let result = 0;
      if (a > b)
        result = 1;
      else if (a < b)
        result = -1;
      if (sort.direction == 'desc')
        result *= -1;
      return result;
    });
    this._data.next(sortedData);
  }
}
