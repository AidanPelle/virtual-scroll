import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';
import { Component } from '@angular/core';

@Component({
  selector: 'app-show-header-example',
  templateUrl: './show-header-example.component.html',
  styleUrl: './show-header-example.component.scss',
    standalone: true,
    imports: [VirtualScrollModule],
})
export class ShowHeaderExampleComponent {
  protected dataSource = this.initSource();
  
    initSource() {
      const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
      return new CustomDataSource(data);
    }
}
