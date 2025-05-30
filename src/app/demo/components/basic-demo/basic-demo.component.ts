import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { CustomDataSource, VirtualScrollModule } from 'virtual-scroll';
@Component({
  selector: 'app-default-demo',
  templateUrl: './basic-demo.component.html',
  styleUrl: './basic-demo.component.scss',
  standalone: true,
  imports: [VirtualScrollModule, MatCardModule],
})
export class BasicDemoComponent {
  protected dataSource = this.initSource();

  initSource() {
    const data = Array.from({length: 10_000}).map((_, i) => `Item #${i + 1}`);
    return new CustomDataSource(data);
  }
}
