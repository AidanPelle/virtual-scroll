import { Directive, ElementRef, HostListener, inject, Input } from '@angular/core';
import { ColumnSelectorDialogComponent } from './column-selector-dialog.component';
import { VirtualScrollComponent } from '../virtual-scroll/virtual-scroll.component';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Directive({
  selector: '[columnSelector]',
})
export class ColumnSelectorDirective<T> {

  private _overlay = inject(Overlay);
  private _hostElement = inject(ElementRef);

  @Input('columnSelector') virtualScroll!: VirtualScrollComponent<T>;

  @HostListener('click')
  onClick() {
    // if (!this.virtualScroll)
    //   throw Error('wh-virtual-scroll columnSelector: no virtual scroll reference provided!');

    // const inputEl = this._hostElement.nativeElement;
    // const rect = inputEl.getBoundingClientRect();
    // let dialogPositionLeft = rect.left;
    // if ((rect.left + 250) > window.innerWidth) {
    //   dialogPositionLeft = rect.right - 250;
    // }
    // if (!this._dialogRef || this._dialogRef.getState() !== MatDialogState.OPEN) {
    //   this._dialogRef = this._dialog.open(ColumnSelectorDialogComponent, {
    //     // width: '240',
    //     // autoFocus: false,

    //     // position the dialog to be centered underneath the host element
    //     // position: {
    //     //   top: '5px',
    //     //   left: '5px'
    //     // },
    //     // backdropClass: 'vs-column-selector-dialog-backdrop',
    //     // panelClass: 'vs-column-selector-dialog-padding',
    //     data: this.virtualScroll
    //   });
    // }
    // this._dialog.open(ColumnSelectorDialogComponent)
    const overlayConfig = this.getOverlayConfig();
    const overlayRef = this._overlay.create(overlayConfig);
    overlayRef.attach(new ComponentPortal(ColumnSelectorDialogComponent));
  }

  private getOverlayConfig() {
    const positionStrategy = this._overlay.position()
      .flexibleConnectedTo(this._hostElement)
      .withFlexibleDimensions(false)
      .withPush()
      .withViewportMargin(1)
      .withPositions([
        {originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top'},
        {originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom'},
      ]);

    return new OverlayConfig ({
      positionStrategy: positionStrategy,
      disposeOnNavigation: true,
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
    });
  }

}
