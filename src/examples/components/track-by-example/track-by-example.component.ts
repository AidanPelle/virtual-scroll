import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { Component, TrackByFunction } from '@angular/core';

@Component({
  selector: 'app-track-by-example',
  templateUrl: './track-by-example.component.html',
  styleUrl: './track-by-example.component.scss',
    standalone: true,
    imports: [VirtualScrollModule],
})
export class TrackByExampleComponent {
  protected dataSource = this.initSource();
  
  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => ({id: i, data: `Item ${i + 1}`}));
    return new CustomDataSource(data);
  }

  trackBy(index: number, item: typeof this.dataSource.data[number]) {
    return item.id;
  }
}
