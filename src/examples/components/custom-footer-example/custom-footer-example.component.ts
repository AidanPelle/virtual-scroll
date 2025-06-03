import { CustomDataSource, VirtualScrollFooterData, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-custom-footer-example',
  templateUrl: './custom-footer-example.component.html',
  styleUrl: './custom-footer-example.component.scss',
    standalone: true,
    imports: [VirtualScrollModule, MatCardModule],
})
export class CustomFooterExampleComponent {
  protected dataSource = this.initSource();
  protected scrollData: VirtualScrollFooterData | null = null;

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }

  getScrollData(scrollData: VirtualScrollFooterData) {
    this.scrollData = scrollData;
  }
}
