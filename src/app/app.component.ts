import { Component, OnInit } from '@angular/core';
import { BaseDataSource, PaginatedDataSource, VirtualScrollModule } from '../../projects/virtual-scroll/src/public-api';
import { delay, of, tap } from 'rxjs';
import { ResizableDemoComponent } from './demo/components/resizable-demo/resizable-demo.component';
import { ColumnWidthsDemoComponent } from './demo/components/column-widths-demo/column-widths-demo.component';
import { DynamicContainerDemoComponent } from './demo/components/dynamic-container-demo/dynamic-container-demo.component';
import { ResponsiveColumnEnablingDemoComponent } from './demo/components/responsive-column-enabling-demo/responsive-column-enabling-demo.component';
import { StickyColumnDemoComponent } from './demo/components/sticky-column-demo/sticky-column-demo.component';
import { ModifyDataDemoComponent } from './demo/components/modify-data-demo/modify-data-demo.component';
import { CompleteListDemoComponent } from './demo/components/complete-list-demo/complete-list-demo.component';
import { PaginatedDemoComponent } from './demo/components/paginated-demo/paginated-demo.component';
import { DemoViewerComponent } from './demo/demo-viewer/demo-viewer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    VirtualScrollModule,
    ResizableDemoComponent,
    ColumnWidthsDemoComponent,
    DynamicContainerDemoComponent,
    ResponsiveColumnEnablingDemoComponent,
    StickyColumnDemoComponent,
    ModifyDataDemoComponent,
    CompleteListDemoComponent,
    PaginatedDemoComponent,
    DemoViewerComponent,
  ],
})
export class AppComponent implements OnInit {
  title = 'aidanpelle-virtual-scroll';

  dataSource: BaseDataSource<string> | null = null;
  loading = true;

  isCell1Active = true;
  isCell2Active = true;

  arrayLength = 10_000;

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
