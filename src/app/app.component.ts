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

  /** Emits whenever we scroll on our parent container. */
  protected _scroll = new BehaviorSubject<number>(0);
  
  /** The list of examples available in the app, used to populate our navbar. */
  protected demoRoutes = EXAMPLE_COMPONENTS;
  
  /** An observable that emits if the current screenWidth is mobile or smaller, and updates if the width changes. */
  protected isMobile$ = this._breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(
    map(result => result.matches),
    shareReplay(1),
  );

  /**
   * Handles if the navbar should be compressed, depending on if the user has scrolled.
   * We use this to animate the header shrinking and opening up screen space when on desktop.
   */
  protected isCompressed$ = combineLatest([this.isMobile$, this._scroll]).pipe(
    map(([isMobile, scrollTop]) => !isMobile && scrollTop > 50),
  );

  /**
   * Emits if the navbar should be open or not, essentially forcing it to open when we go to desktop view,
   * and forcing it to close when we go to mobile view.
   */
  protected isNavbarOpen$ = this.isMobile$.pipe(
    map(isHandset => {
      return !isHandset;
    }),
  );

  constructor() {
    this._iconRegistry.addSvgIcon('github-logo', this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/github-mark.svg'));
  }

  /**
   * Returns if, for the given route in the navbar, we've navigated to it.
   * This is used to highlight which example component we're currently on.
   */
  protected isRouteActivated(route: string) {
    return this._router.url.includes(route);
  }

  /**
   * This function handles closing the navbar, when a route has been selected on mobile devices,
   * in order to clear up screen space.
   */
  protected closeSidenavOnMobile() {
    this.isMobile$.pipe(
      take(1)
    ).subscribe(isMobile => {
      if (isMobile)
        this._sidenav.close();
    })
  }
}
