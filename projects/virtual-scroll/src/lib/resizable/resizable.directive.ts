import { Directive, EventEmitter, HostListener, OnDestroy, Output } from '@angular/core';
import { Subscription, asyncScheduler, fromEvent, map, pairwise, startWith, throttleTime } from 'rxjs';

/**
 * Handles when a user is resizing a column. We need to keep track of when
 * they're dragging the resize bar across the screen, and when they let go.
 */
@Directive({
  selector: '[vsResizable]',
})
export class ResizableDirective implements OnDestroy {


  /**
   * Emit to virtual-scroll.component.ts when a resize event has been triggered, so that
   * we can update the column widths for our list.
   */
  @Output() resize: EventEmitter<number> = new EventEmitter<number>();


  /**
   * Emit to virtual-scroll.component.ts when the user has double clicked a resize bar
   * in order to reset the sizes for all the columns.
   */
  @Output() resetSizes: EventEmitter<any> = new EventEmitter<any>();


  /**
   * Maintain a reference to our mouse move subscription, so that we can make sure we're only
   * subscribed to the user's mouse moving when they're trying to drag a column. Allows for
   * better performance when moving mouse across the screen.
   */
  private mouseMoveSubscription: Subscription | null = null;


  /**
   * Maintain a reference to our mouse move subscription, so that we can make sure we're only
   * subscribed to the user's mouse moving when they're trying to drag a column. Allows for
   * better performance when moving mouse across the screen.
   */
  private touchMoveSubscription: Subscription | null = null;


  /**
   * Keeps track of when the user has clicked on the resize bar for this specific directive.
   * This is scoped to the resize bar specifically. We only activate the subscription when
   * pressed, so that we aren't listening when we don't need to.
   * 
   * @param event The mousedown event for when the user has pressed down.
   */
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.subscribeToMouseMove(event.clientX);
  }


  private hasBeenClicked: boolean = false;
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    event.preventDefault();
    this.subscribeToTouchMove(event.touches[0].clientX);

    if (this.hasBeenClicked) {
      this.hasBeenClicked = false;
      this.resetSizes.emit();
    } else {
      this.hasBeenClicked = true;
      setTimeout(() => {
        this.hasBeenClicked = false;
      }, 600);
    }
  }

  /**
   * Keeps track of when the user has released the mouse button, allowing us to cancel
   * the subscription, since they're no longer trying to drag the resize bar.
   */
  @HostListener('document:touchend')
  onTouchEnd() {
    this.touchMoveSubscription?.unsubscribe();
  }


  /**
   * Keeps track of when the user has released the mouse button, allowing us to cancel
   * the subscription, since they're no longer trying to drag the resize bar.
   */
  @HostListener('document:mouseup')
  onMouseUp() {
    this.mouseMoveSubscription?.unsubscribe();
  }


  /**
   * Captures when a user double clicks one of the resize bars, so that we can tell
   * all the columns to reset their sizing. Currently not implemented, but will consider
   * in the future.
   */
  @HostListener('dblclick') onDoubleClicked() {
    this.resetSizes.emit();
  }

  constructor() {}


  /**
   * The meat of this function. We maintain a subscription to the document's mousemove event
   * to capture the mouse's movement across the page.
   * 
   * We throttle the output as the document normally emits hundreds/thousands of times a second,
   * and we don't need that granularity. Performance is greatly improved by throttling to 40 times a second.
   */
  private subscribeToTouchMove(initialX: number): void {
    this.touchMoveSubscription?.unsubscribe();
    this.touchMoveSubscription = fromEvent<TouchEvent>(document, 'touchmove')
    .pipe(
      throttleTime(25, asyncScheduler, { trailing: true }),
      map(event => event.touches[0].clientX),
      startWith(initialX),
      pairwise(),
    )
    .subscribe(([firstX, secondX]) => {

       /**
       * Derive how much the mouse has moved since the most recent emission, and release
       * that data to virtual-scroll.component.ts.
       */
       const deltaX = secondX - firstX;
      
       this.resize.emit(deltaX);
    });
  }


  /**
   * The meat of this function. We maintain a subscription to the document's mousemove event
   * to capture the mouse's movement across the page.
   * 
   * We throttle the output as the document normally emits hundreds/thousands of times a second,
   * and we don't need that granularity. Performance is greatly improved by throttling to 40 times a second.
   */
  private subscribeToMouseMove(initialX: number): void {
    this.mouseMoveSubscription?.unsubscribe();
    this.mouseMoveSubscription = fromEvent<MouseEvent>(document, 'mousemove')
    .pipe(
      throttleTime(25, asyncScheduler, { trailing: true }),
      map(event => event.clientX),
      startWith(initialX),
      pairwise(),
    )
    .subscribe(([firstX, secondX]) => {

      /**
       * Derive how much the mouse has moved since the most recent emission, and release
       * that data to virtual-scroll.component.ts.
       */
      const deltaX = secondX - firstX;
      
      this.resize.emit(deltaX);
    });
  }


  /**
   * In case we missed unsubscribing from the user's mouse for whatever reason, we want to
   * close the subscription when the directive is destroyed.
   */
  ngOnDestroy(): void {
    this.mouseMoveSubscription?.unsubscribe();
    this.touchMoveSubscription?.unsubscribe();
  }
}
