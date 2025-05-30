import { ChangeDetectorRef, Component, inject, Injector, Input, Type, ViewContainerRef } from '@angular/core';
import { DEMO_COMPONENTS } from '../demo-map';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demo-viewer',
  templateUrl: './demo-viewer.component.html',
  styleUrl: './demo-viewer.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class DemoViewerComponent {
  private _viewContainerRef = inject(ViewContainerRef);
  private _injector = inject(Injector);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  @Input() componentId!: string;

  htmlFile?: string;
  scssFile?: string;
  tsFile?: string;
  
  async ngOnInit() {
    const example = await this.loadExample(this.componentId);
    this._viewContainerRef.createComponent(example, {injector: this._injector});
    this._changeDetectorRef.markForCheck();
  }

  async loadExample(name: string): Promise<Type<unknown>> {
    const component = DEMO_COMPONENTS[name];
    
    this.htmlFile = (await import(`../${name}/${name}.component.html`)).default;
    this.scssFile = await import(`../${name}/${name}.component.scss`);
    this.tsFile = await import(`../${name}/${name}.component.ts`);

    console.log(this.htmlFile);

    // import(`../${name}/${name}.component.html`).then((res) => {
    //   console.log(res);
    //   return res.default;
    // }).then(console.log);
    
    return component;
  }

}
