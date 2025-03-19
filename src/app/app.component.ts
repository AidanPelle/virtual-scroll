import { Component } from '@angular/core';
import { VirtualScrollModule } from '../../projects/virtual-scroll/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VirtualScrollModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'aidanpelle-virtual-scroll';
}
