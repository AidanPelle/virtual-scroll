import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-active-column-example',
  templateUrl: './active-column-example.component.html',
  styleUrl: './active-column-example.component.scss',
    standalone: true,
    imports: [
      VirtualScrollModule,
      MatButtonModule,
    ],
})
export class ActiveColumnExampleComponent implements OnInit {
  protected dataSource = this.initSource();

  private _activatedRoute = inject(ActivatedRoute);

  isColumnActive = true;

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(paramMap => {
      this.isColumnActive = paramMap['isActive'] != 'false';
    });
  }
}
