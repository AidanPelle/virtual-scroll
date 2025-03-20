import { Directive, inject, TemplateRef, Input } from "@angular/core";
import { VirtualScrollComponent } from "../virtual-scroll/virtual-scroll.component";
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, shareReplay, startWith } from "rxjs";

@Directive({
  selector: '[cellDef]',
})
export class CellDefDirective {

  public template = inject(TemplateRef);
  private _virtualScroll = inject(VirtualScrollComponent);

  @Input('cellDefName') columnName: string = '';

  /**
   * Test
   */
  @Input('cellDefAlign') set align(value: 'start' | 'center' | 'end') {
    this._align = value;
  }
  private _align: 'start' | 'center' | 'end' = 'start';
  public get align(): null | 'center' | 'flex-end' {
    return this._align === 'start' ? null : this._align === 'center' ? this._align : 'flex-end';
  }

  @Input('cellDefFlex') flex: number = 1;

  @Input('cellDefMinWidth') minWidth: number = 32;

  @Input('cellDefMaxWidth') maxWidth: number | null = null;


  /**
   * Handles if a column is on or off when rendering the table.
   */
  @Input('cellDefIsActive') set isActive(value: boolean) {
    this._defaultIsActive.next(value);
  }
  private _defaultIsActive = new BehaviorSubject<boolean>(true);


  @Input('cellDefMinDisplay') minDisplay: number | null = null;

  @Input('cellDefMaxDisplay') maxDisplay: number | null = null;

  @Input('cellDefFixedWidth') fixedWidth: number | null = null;


  /**
   * Handles the current state as selected by a user.
   * Public so that components like the (future) column selector can enable/disable columns.
   */
  public userDefinedActiveState = new BehaviorSubject<boolean | null>(null);
  
  public activeState$ = combineLatest([this.userDefinedActiveState, this._virtualScroll.resize$, this._defaultIsActive]).pipe(
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
    // We use distinct here to primarily avoid repeat calls from windowResize,so that column toggling only happens when active status actually changes
    distinctUntilChanged(),
    shareReplay(1),
  );
}
