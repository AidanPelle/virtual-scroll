import { Component, OnInit } from '@angular/core';
import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';

@Component({
  selector: 'app-loading-template-example',
  templateUrl: './loading-template-example.component.html',
  styleUrl: './loading-template-example.component.scss',
    standalone: true,
    imports: [VirtualScrollModule],
})
export class LoadingTemplateExampleComponent implements OnInit {
  protected dataSource = this.initSource();
  protected loading = true;

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 5_000);
  }
}
