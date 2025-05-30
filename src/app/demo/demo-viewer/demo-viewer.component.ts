import { ChangeDetectorRef, Component, inject, Injector, ViewContainerRef } from '@angular/core';
import { DEMO_COMPONENTS } from '../demo-map';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { HighlightModule } from 'ngx-highlightjs';
import { ActivatedRoute } from '@angular/router';

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
  private _route = inject(ActivatedRoute);

  fileViews: {title: string, file: string, language: string}[] = [];
  selectedDemo?: typeof DEMO_COMPONENTS[string];

  selectedTabIndex = 0;

  private _onDestroy = new Subject<void>();

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
  
  ngOnInit() {
    this._route.params.pipe(takeUntil(this._onDestroy)).subscribe(params => {
      this._viewContainerRef.clear();
      this.selectedTabIndex = 0;
      const componentId = params['componentId'];
      this.selectedDemo = this.loadExample(componentId);
      this._viewContainerRef.createComponent(this.selectedDemo.component, {injector: this._injector});
      this._changeDetectorRef.markForCheck();
    }); 
  }

  loadExample(name: string): typeof DEMO_COMPONENTS[string] {
    const demo = DEMO_COMPONENTS[name];
    
    const htmlFile$ = this._http.get(`assets/components/${name}-demo/${name}-demo.component.html`, { responseType: 'text' });
    const tsFile$ = this._http.get(`assets/components/${name}-demo/${name}-demo.component.ts`, { responseType: 'text' });
    const scssFile$ = this._http.get(`assets/components/${name}-demo/${name}-demo.component.scss`, { responseType: 'text' });

    forkJoin([htmlFile$, tsFile$, scssFile$]).subscribe(([htmlFile, tsFile, scssFile]) => {
      this.fileViews = [];
      this.fileViews.push({title: 'HTML', file: htmlFile, language: 'html'});
      this.fileViews.push({title: 'TS', file: tsFile, language: 'typescript'});
      if ((scssFile?.length ?? 0) > 0)
        this.fileViews.push({title: 'SCSS', file: scssFile, language: 'css'});
    });

    return demo;
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
