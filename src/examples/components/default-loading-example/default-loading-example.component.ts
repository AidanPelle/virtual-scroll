import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-default-loading-example',
  templateUrl: './default-loading-example.component.html',
  styleUrl: './default-loading-example.component.scss',
  standalone: true,
  imports: [VirtualScrollModule, MatCardModule],
})
export class DefaultLoadingExampleComponent implements OnInit {
  protected dataSource = this.initSource();
  protected infoLog: string[] = [];
  protected loading = true;

  ngOnInit(): void {
    this.infoLog.push("Started user loading state");
    setTimeout(() => {
      this.infoLog.push("Finished user loading state");
      this.loading = false;
    }, 2_000);
  }

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
