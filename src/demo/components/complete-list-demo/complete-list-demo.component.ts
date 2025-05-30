import { Component } from '@angular/core';
import { CompleteDataSource, VirtualScrollModule } from 'virtual-scroll';
import { MatCardModule } from '@angular/material/card';
import { delay, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-complete-list-demo',
  templateUrl: './complete-list-demo.component.html',
  styleUrl: './complete-list-demo.component.scss',
  standalone: true,
  imports: [VirtualScrollModule, MatCardModule, CommonModule],
})
export class CompleteListDemoComponent {
  infoLog: string[] = [];

  getData = () => {
    this.infoLog.push("Called: getData");
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return of(data).pipe(
      delay(1_000),
      tap(() => this.infoLog.push("Finished: getData")),
    );
  }

  protected dataSource = new CompleteDataSource(this.getData);  
}
