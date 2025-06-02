import { Component } from '@angular/core';
import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';

@Component({
  selector: 'app-responsive-column-enabling-example',
  templateUrl: './responsive-column-enabling-example.component.html',
  styleUrl: './responsive-column-enabling-example.component.scss',
  standalone: true,
  imports: [VirtualScrollModule],
})
export class ResponsiveColumnEnablingExampleComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
