import { Component, OnInit } from '@angular/core';
import { VirtualScrollModule } from '../../projects/virtual-scroll/src/public-api';
import { delay, of } from 'rxjs';
import { CustomDataSource } from '../../projects/virtual-scroll/src/lib/data-sources/custom-data-source';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VirtualScrollModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'aidanpelle-virtual-scroll';

  dataSource: CustomDataSource<string> | null = null;
  loading = true;

  isCell1Active = true;
  isCell2Active = true;

  ngOnInit(): void {
    of(0).pipe(delay(2_000)).subscribe(() => {
      const items = Array.from({length: 1_000_000}).map((_, i) => `Item #${i}`);
      this.dataSource = new CustomDataSource(items);
    });
  }
}
