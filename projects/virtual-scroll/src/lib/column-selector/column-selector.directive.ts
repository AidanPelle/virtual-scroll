import { Directive, ElementRef, HostListener, inject, Input } from '@angular/core';
import { ColumnSelectorDialogComponent } from './column-selector-dialog.component';
import { VirtualScrollComponent } from '../virtual-scroll/virtual-scroll.component';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[columnSelector]',
})
export class ColumnSelectorDirective {

  private _overlay = inject(Overlay);
  private _hostElement = inject(ElementRef);

  @Input('columnSelector') virtualScroll!: VirtualScrollComponent<any>;

  private _overlayRef: OverlayRef | null = null;

  @HostListener('click')
  onClick() {
    if (this._overlayRef?.hasAttached())
      return;

    const overlayConfig = this.getOverlayConfig();
    this._overlayRef = this._overlay.create(overlayConfig);
    const componentRef = this._overlayRef.attach(new ComponentPortal(ColumnSelectorDialogComponent));
    componentRef.instance.virtualScroll = this.virtualScroll;

    const closed$ = new Subject<void>();
    this._overlayRef.outsidePointerEvents().pipe(
      takeUntil(closed$),
    ).subscribe((event) => {
      event.stopPropagation();
      closed$.next();
      closed$.complete();
      this._overlayRef?.detach();
      this._overlayRef?.dispose();
    })
  }

  private getOverlayConfig() {
    const positionStrategy = this._overlay.position()
      .flexibleConnectedTo(this._hostElement)
      .withFlexibleDimensions(false)
      .withPush()
      .withViewportMargin(1)
      .withPositions([
        {originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 5},
        {originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: 5},
      ]);

    return new OverlayConfig ({
      positionStrategy: positionStrategy,
      disposeOnNavigation: true,
      hasBackdrop: false,
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
    });
  }

}
