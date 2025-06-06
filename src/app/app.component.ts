import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { EXAMPLE_COMPONENTS } from '../examples/example-map';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, combineLatest, map, scan, shareReplay, startWith, Subject, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    CommonModule,
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
  private _breakpointObserver = inject(BreakpointObserver);

  @ViewChild(MatSidenav, {static: true}) _sidenav!: MatSidenav;

  protected _isMobile$ = this._breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(
    map(result => result.matches),
    shareReplay(1),
  );

  protected _toggleNavbar = new Subject<void>();

  protected _isNavbarOpen$ = this._isMobile$.pipe(
    map(isHandset => {
      return !isHandset;
    }),
  );

  protected _scroll = new BehaviorSubject<number>(0);

  protected _headerWidth$ = combineLatest([this._isMobile$, this._scroll]).pipe(
    map(([isMobile, scrollTop]) => {
      if (isMobile || scrollTop < 50)
        return "100%";
      return "0";
    }),
  );

  constructor() {
    this._iconRegistry.addSvgIcon('github-logo', this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/github-mark.svg'));
  }

  demoRoutes = EXAMPLE_COMPONENTS;

  isRouteActivated(route: string) {
    return this._router.url.includes(route);
  }

  closeSidenavOnMobile() {
    this._isMobile$.pipe(
      take(1)
    ).subscribe(isMobile => {
      if (isMobile)
        this._sidenav.close();
    })
  }
}
