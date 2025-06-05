import { ChangeDetectorRef, Component, inject, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { EXAMPLE_COMPONENTS } from '../example-map';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { HighlightModule } from 'ngx-highlightjs';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-example-viewer',
  templateUrl: './example-viewer.component.html',
  styleUrl: './example-viewer.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    HighlightModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ClipboardModule,
  ],
})
export class ExampleViewerComponent {
  private _injector = inject(Injector);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _http = inject(HttpClient);
  private _route = inject(ActivatedRoute);
  private _snackbar = inject(MatSnackBar);

  @ViewChild('exampleComponentContainer', {static: true, read: ViewContainerRef}) _viewContainerRef!: ViewContainerRef;

  private _baseUrl = "https://raw.githubusercontent.com/AidanPelle/virtual-scroll/main/src/examples/components";

  protected _showCodeView = false;

  fileViews: {title: string, file: string, language: string}[] = [];
  selectedExample?: typeof EXAMPLE_COMPONENTS[string];

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
      this.selectedExample = this.loadExample(componentId);
      this._viewContainerRef.createComponent(this.selectedExample.component, {injector: this._injector});
      this._changeDetectorRef.markForCheck();
    }); 
  }

  loadExample(name: string): typeof EXAMPLE_COMPONENTS[string] {
    const demo = EXAMPLE_COMPONENTS[name];

    const htmlFile$ = this._http.get(`${this._baseUrl}/${name}-example/${name}-example.component.html`, { responseType: 'text' });
    const tsFile$ = this._http.get(`${this._baseUrl}/${name}-example/${name}-example.component.ts`, { responseType: 'text' });
    const scssFile$ = this._http.get(`${this._baseUrl}/${name}-example/${name}-example.component.scss`, { responseType: 'text' });

    forkJoin([htmlFile$, tsFile$, scssFile$]).subscribe(([htmlFile, tsFile, scssFile]) => {
      this.fileViews = [];
      this.fileViews.push({title: 'HTML', file: htmlFile, language: 'html'});
      this.fileViews.push({title: 'TS', file: tsFile, language: 'typescript'});
      if ((scssFile?.length ?? 0) > 0)
        this.fileViews.push({title: 'SCSS', file: scssFile, language: 'css'});
    });

    return demo;
  }

  copiedToClipboard() {
    this._snackbar.open('Example copied');
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
