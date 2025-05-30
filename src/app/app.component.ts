import { Component, inject } from '@angular/core';
import { VirtualScrollModule } from '../../projects/virtual-scroll/src/public-api';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { DEMO_COMPONENTS } from '../demo/demo-map';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    VirtualScrollModule,
    MatSidenavModule,
    MatListModule,
    RouterLink,
    RouterOutlet,
  ],
})
export class AppComponent {
  protected _router = inject(Router);
  demoRoutes = DEMO_COMPONENTS;

  isRouteActivated(route: string) {
    return this._router.url.includes(route);
  }
}
