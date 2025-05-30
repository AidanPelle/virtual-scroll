import { ChangeDetectorRef, Component, inject, Injector, Input, Type, ViewContainerRef } from '@angular/core';
import { DEMO_COMPONENTS } from '../demo-map';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'app-demo-viewer',
  templateUrl: './demo-viewer.component.html',
  styleUrl: './demo-viewer.component.scss',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule, HighlightModule],
})
export class DemoViewerComponent {
  private _viewContainerRef = inject(ViewContainerRef);
  private _injector = inject(Injector);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _http = inject(HttpClient);

  @Input() componentId!: string;

  fileViews: {title: string, file: string, language: string}[] = [];

  selectedTabIndex = 0;

  get selectedFileView(): string {
    if (this.fileViews[this.selectedTabIndex])
      return this.fileViews[this.selectedTabIndex].file;
    return '';
  }

  get selectedFileLanguage(): string {
    if (this.fileViews[this.selectedTabIndex])
      return this.fileViews[this.selectedTabIndex].language;
    return '';
  }
  
  async ngOnInit() {
    const example = await this.loadExample(this.componentId);
    this._viewContainerRef.createComponent(example, {injector: this._injector});
    this._changeDetectorRef.markForCheck();
  }

  async loadExample(name: string): Promise<Type<unknown>> {
    const component = DEMO_COMPONENTS[name];
    
    const htmlFile$ = this._http.get(`assets/components/${name}/${name}.component.html`, { responseType: 'text' });
    const tsFile$ = this._http.get(`assets/components/${name}/${name}.component.ts`, { responseType: 'text' });
    const scssFile$ = this._http.get(`assets/components/${name}/${name}.component.scss`, { responseType: 'text' });

    forkJoin([htmlFile$, tsFile$, scssFile$]).subscribe(([htmlFile, tsFile, scssFile]) => {
      this.fileViews.push({title: 'HTML', file: htmlFile, language: 'html'});
      this.fileViews.push({title: 'TS', file: tsFile, language: 'typescript'});
      if ((scssFile?.length ?? 0) > 0)
        this.fileViews.push({title: 'SCSS', file: scssFile, language: 'css'});
    });

    return component;
  }

}
