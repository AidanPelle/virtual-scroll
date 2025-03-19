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

  dataSource: CustomDataSource<number> | null = null;
  loading = true;

  ngOnInit(): void {
    of(0).pipe(delay(2_000)).subscribe(() => {
      const array: number[] = [1];
      this.dataSource = new CustomDataSource(array);
    });
  }
}
