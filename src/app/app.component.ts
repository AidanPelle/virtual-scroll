import { Component, OnInit } from '@angular/core';
import { BaseDataSource, VirtualScrollModule } from '../../projects/virtual-scroll/src/public-api';
import { delay, of, tap } from 'rxjs';
import { CustomDataSource } from '../../projects/virtual-scroll/src/lib/data-sources/custom-data-source';
import { CompleteDataSource } from '../../projects/virtual-scroll/src/lib/data-sources/complete-data-source';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VirtualScrollModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'aidanpelle-virtual-scroll';

  dataSource: BaseDataSource<string> | null = null;
  loading = true;

  isCell1Active = true;
  isCell2Active = true;

  arrayLength = 10;

  ngOnInit(): void {
    console.log("Loading dataSource Called")
    of(0).pipe(delay(2_000)).subscribe(() => {
      this.dataSource = new CompleteDataSource(this.getData);
    });
  }

  getData = () => {
    return of(Array.from({length: this.arrayLength}).map((_, i) => `Item #${i}`)).pipe(
      tap(() => console.log("Get Data Called")),
      delay(2_000),
      tap(() => console.log("Get Data Finished")),
    );
  }
}
