import { Component } from '@angular/core';
import { CustomDataSource, VirtualScrollModule } from '@aidan-pelle/virtual-scroll';

@Component({
  selector: 'app-empty-state-template-example',
  templateUrl: './empty-state-template-example.component.html',
  styleUrl: './empty-state-template-example.component.scss',
    standalone: true,
    imports: [VirtualScrollModule],
})
export class EmptyStateTemplateExampleComponent {
  protected dataSource = new CustomDataSource([]);
}
