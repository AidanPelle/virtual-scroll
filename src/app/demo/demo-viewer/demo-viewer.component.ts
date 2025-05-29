import { ChangeDetectorRef, Component, inject, Injector, Input, Type, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-demo-viewer',
  templateUrl: './demo-viewer.component.html',
  styleUrl: './demo-viewer.component.scss',
  standalone: true,
})
export class DemoViewerComponent {
  private _viewContainerRef = inject(ViewContainerRef);
  private _injector = inject(Injector);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  @Input() componentId!: string;
  
  async ngOnInit() {
    const example = await this.loadExample(this.componentId);
    this._viewContainerRef.createComponent(example, {injector: this._injector});
    this._changeDetectorRef.markForCheck();
  }

  async loadExample(name: string): Promise<Type<unknown>> {
    const {componentName, importPath} = EXAMPLE_COMPONENTS[name];
    const moduleExports = await import(`/bundles/components-examples/${importPath}/index.js`);
    const componentType: Type<unknown> = moduleExports[componentName];

    return componentType;
  }

}
