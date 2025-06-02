import { Component } from '@angular/core';
import { CompleteDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { MatCardModule } from '@angular/material/card';
import { delay, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-complete-list-example',
  templateUrl: './complete-list-example.component.html',
  styleUrl: './complete-list-example.component.scss',
  standalone: true,
  imports: [VirtualScrollModule, MatCardModule, CommonModule],
})
export class CompleteListExampleComponent {
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
