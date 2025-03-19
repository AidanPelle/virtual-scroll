import { Directive, inject, ViewContainerRef } from "@angular/core";

@Directive({
  selector: '[cellOutlet]',
})
export class CellOutletDirective {

  public viewContainer = inject(ViewContainerRef);

  /**
   * Similar to how mat table does it, we get a static reference to the most recently generated view, which allows us to embed cell definitions inside it.
   */
  static mostRecentView: CellOutletDirective | null = null;

  constructor() {
    CellOutletDirective.mostRecentView = this;
  }

}
