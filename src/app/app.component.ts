import { Component, inject } from '@angular/core';
import { VirtualScrollModule } from '../../projects/virtual-scroll/src/public-api';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { EXAMPLE_COMPONENTS } from '../examples/example-map';

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
    MatButtonModule,
    MatIconModule,
  ],
})
export class AppComponent {
  private _router = inject(Router);
  private _iconRegistry = inject(MatIconRegistry);
  private _sanitizer = inject(DomSanitizer);

  constructor() {
    this._iconRegistry.addSvgIcon('github-logo', this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/github-mark.svg'));
  }

  demoRoutes = EXAMPLE_COMPONENTS;

  isRouteActivated(route: string) {
    return this._router.url.includes(route);
  }
}
