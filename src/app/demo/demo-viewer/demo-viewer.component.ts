import { ChangeDetectorRef, Component, inject, Injector, Input, Type, ViewContainerRef } from '@angular/core';
import { DEMO_COMPONENTS } from '../demo-map';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Component({
  selector: 'app-demo-viewer',
  templateUrl: './demo-viewer.component.html',
  styleUrl: './demo-viewer.component.scss',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  // providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class DemoViewerComponent {
  private _viewContainerRef = inject(ViewContainerRef);
  private _injector = inject(Injector);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _http = inject(HttpClient);

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
    
    this._http.get(`assets/components/${name}/${name}.component.html`, { responseType: 'text' })
      .subscribe(html => this.htmlFile = html);
    
    this._http.get(`assets/components/${name}/${name}.component.scss`, { responseType: 'text' })
      .subscribe(scss => this.scssFile = scss);
    
    this._http.get(`assets/components/${name}/${name}.component.ts`, { responseType: 'text' })
      .subscribe(ts => this.tsFile = ts);

    return component;
  }

}
