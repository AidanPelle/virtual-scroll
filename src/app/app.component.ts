import { Component, OnInit } from '@angular/core';
import { VirtualScrollModule } from '../../projects/virtual-scroll/src/public-api';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VirtualScrollModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'aidanpelle-virtual-scroll';

  dataSource: number[] = [1, 2, 3, 4];
  loading = true;

  ngOnInit(): void {
    of(0).pipe(delay(2_000)).subscribe(() => {
      this.loading = false;
    });
  }
}
