import { Component } from '@angular/core';
import { of, delay, tap } from 'rxjs';
import { PaginatedDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-paginated-demo',
  templateUrl: './paginated-demo.component.html',
  styleUrl: './paginated-demo.component.scss',
  standalone: true,
  imports: [VirtualScrollModule, MatCardModule, CommonModule],
})
export class PaginatedDemoComponent {
  infoLog: string[] = [];

  getCount = () => {
    this.infoLog.push("Called: getCount");
    return of(400_000).pipe(
      delay(1_000),
      tap(() => this.infoLog.push("Finished: getCount")),
    );
  }

  getPageOfData = (index: number, pageSize: number) => {
    this.infoLog.push(`Called: getPageOfData, index: ${index}, page size: ${pageSize}`);
    const data = Array.from({length: pageSize}).map((_, i) => `Item #${i + 1 + index}`);
    return of(data).pipe(
      delay(1_000),
      tap(() => this.infoLog.push(`Finished: getPageOfData, index: ${index}, page size: ${pageSize}`)),
    );
  }

  protected dataSource = new PaginatedDataSource(this.getPageOfData, this.getCount);  
}
