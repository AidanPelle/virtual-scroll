import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[rowOutlet]',
})
export class RowOutletDirective implements OnInit {

  private _viewContainer = inject(ViewContainerRef);

  @Input() rowTemplate!: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
    this._viewContainer.createEmbeddedView(this.rowTemplate);
  }

}
