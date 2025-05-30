import { Component, OnInit } from '@angular/core';
import { BaseDataSource, PaginatedDataSource, VirtualScrollModule } from '../../projects/virtual-scroll/src/public-api';
import { delay, of, tap } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DEMO_COMPONENTS } from './demo/demo-map';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    VirtualScrollModule,
    MatSidenavModule,
    MatListModule,
    RouterLink,
    RouterOutlet,
  ],
})
export class AppComponent implements OnInit {
  title = 'aidanpelle-virtual-scroll';

  dataSource: BaseDataSource<string> | null = null;
  loading = true;

  isCell1Active = true;
  isCell2Active = true;

  arrayLength = 10_000;

  demoRoutes = DEMO_COMPONENTS;

  ngOnInit(): void {
    of(0).pipe(
      tap(() => console.log("Loading DataSource Called")),
      delay(1_000),
      tap(() => console.log("Loading DataSource Finished")),
    ).subscribe(() => {
      this.dataSource = new PaginatedDataSource(this.getPageOfData, this.getCount);
    });
    // this.dataSource = new PaginatedDataSource(this.getPageOfData, this.getCount);
  }

  getData = () => {
    return of(Array.from({length: this.arrayLength}).map((_, i) => `Item #${i}`)).pipe(
      tap(() => console.log("Get Data Called")),
      delay(2_000),
      tap(() => console.log("Get Data Finished")),
    );
  }

  getCount = () => {
    return of(this.arrayLength).pipe(
      tap(() => console.log("Get Count Called")),
      delay(2_000),
      tap(() => console.log("Get Count Finished")),
    );
  }

  getPageOfData = (index: number, pageSize: number) => {
    return of(Array.from({length: pageSize}).map((_, i) => `Item #${i + index + 1}`)).pipe(
      tap(() => console.log("Get Page of Data Called")),
      delay(2_000),
      tap(() => console.log("Get Page of Data Finished")),
    );
  }
}
