import { Directive, inject, TemplateRef, Input } from "@angular/core";
import { VirtualScrollComponent } from "../virtual-scroll/virtual-scroll.component";
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, shareReplay } from "rxjs";

@Directive({
  selector: '[cellDef]',
})
export class CellDefDirective {

  public template = inject(TemplateRef);
  private _virtualScroll = inject(VirtualScrollComponent);

  /** A unique name for the column. Used for rendering the header, and populating the column selector dialog. */
  @Input('cellDefName') columnName: string = '';

  /** The alignment of content in this column, default being at the beginning of the column. */
  @Input('cellDefAlign')
  get align(): null | 'center' | 'flex-end' {
    return this._align === 'start' ? null : this._align === 'center' ? this._align : 'flex-end';
  }
  set align(value: 'start' | 'center' | 'end') {
    this._align = value;
  }
  private _align: 'start' | 'center' | 'end' = 'start';

  /** What fraction of the row this column should take up, when there's extra space available. */
  @Input('cellDefFlex') flex: number = 1;

  /** The minimum width of a column, in pixels. */
  @Input('cellDefMinWidth') minWidth: number = 32;

  /** The maximum width of a column, in pixels. */
  @Input('cellDefMaxWidth') maxWidth: number | null = null;


  /** Handles if a column is on or off when rendering the table. */
  @Input('cellDefIsActive') set isActive(value: boolean) {
    this._defaultIsActive.next(value);
  }
  private _defaultIsActive = new BehaviorSubject<boolean>(true);

  /**
   * The smallest screen width at which this column will be displayed.
   * When the screen width is below this value, the column will be turned off.
   *
   * This can be overriden by manually turning the column on/off from the column selector.
  */
  @Input('cellDefMinDisplay') minDisplay: number | null = null;

  /**
   * The largest screen width at which this column will be displayed.
   * When the screen width is above this value, the column will be turned off.
   *
   * This can be overriden by manually turning the column on/off from the column selector.
  */
  @Input('cellDefMaxDisplay') maxDisplay: number | null = null;

  /**
   * A static width for a column, provided by the user implementing this component.
   * When this is applied, the column will not grow/shrink responsively, and will stay its width.
   */
  @Input('cellDefFixedWidth') originalFixedWidth: number | null = null;

  /**
   * The computed fixed width, where the default provided by the user can be overriden by manually resizing a column
   * using the resize bars in the header.
   */
  get fixedWidth(): number | null {
    return this._modifiedFixedWidth ?? this.originalFixedWidth;
  }
  set fixedWidth(value: number | null) {
    this._modifiedFixedWidth = value;
  }
  private _modifiedFixedWidth: number | null = null;

  /**
   * Designates this column as 'sticky', where it'll catch on the left/right side of the container when scrolling,
   * to ensure that the column always remains visible.
   */
  @Input('cellDefIsSticky') isSticky = false;

  /**
   * Handles the current state as selected by a user.
   * Public so that components like the (future) column selector can enable/disable columns.
   */
  userDefinedActiveState = new BehaviorSubject<boolean | null>(null);

  /**
   * The computed state determining if this column is currently visible or not to the user, depending on user input,
   * display widths, and manually set active states.
   */
  activeState$ = combineLatest([this.userDefinedActiveState, this._virtualScroll.throttledResize$, this._defaultIsActive]).pipe(
    // We don't care about the resize event's value, but we do need the trigger to recalc on min/max widths
    map(([userDefinedActiveState,, defaultIsActive]) => {
      // For active state, it is first decided by if the user has enabled/disabled the column. If so, this overrides all other actions.
      if (userDefinedActiveState != null)
        return userDefinedActiveState;

      // If user active state has not been set, then we make sure the column has not been deactivated by being outside of min/max width params
      if (this.minDisplay != null && window.innerWidth <  this.minDisplay)
        return false;

      if (this.maxDisplay != null && window.innerWidth > this.maxDisplay)
        return false;

      return defaultIsActive;
    }),
    // We use distinct here to primarily avoid repeat calls from windowResize, so that column toggling only happens when active status actually changes
    distinctUntilChanged(),
    shareReplay(1),
  );
}
