import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-async-data-source-example',
  templateUrl: './async-data-source-example.component.html',
  styleUrl: './async-data-source-example.component.scss',
  standalone: true,
  imports: [VirtualScrollModule, MatCardModule],
})
export class AsyncDataSourceExampleComponent {
  protected dataSource: CustomDataSource<string> | null = null;
  protected infoLog: string[] = [];

  ngOnInit(): void {
    this.infoLog.push("Started loading dataSource");
    setTimeout(() => {
      this.infoLog.push("Finished loading dataSource");
      const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
      this.dataSource = new CustomDataSource(data);
    }, 2_000);
  }
}
