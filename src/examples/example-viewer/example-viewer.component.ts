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

  /** The container where we'll be rendering our example components, so that they're contained in the same mat-card. */
  @ViewChild('exampleComponentContainer', {static: true, read: ViewContainerRef}) _viewContainerRef!: ViewContainerRef;
  
  /** 
   * The list of available source code pages for the rendered component.
   * HTML and TS are always available, but SCSS will only be served if necessary.
   */
  protected fileViews: {title: string, file: string, language: string}[] = [];
  
  /** Which example is currently being used, we keep a reference to grab the title and subtitle for display. */
  protected selectedExample?: typeof EXAMPLE_COMPONENTS[string];
  
  /** The coding language of the current selected code view, used for highlightjs. */
  protected get selectedFileLanguage(): string {
    if (this.fileViews[this.selectedTabIndex])
      return this.fileViews[this.selectedTabIndex].language;
    return '';
  }

  /** The source code for the selected code view tab. */
  protected get selectedFileView(): string {
    if (this.fileViews[this.selectedTabIndex])
      return this.fileViews[this.selectedTabIndex].file;
    return '';
  }
  
  /** Which code view tab is current selected, HTML, SCSS or TS */
  protected selectedTabIndex = 0;
  
  /** Handles if the tab for showing code view is visible or not. */
  protected showCodeView = false;
  
  /** The GitHub base url for finding the source code for a component.  */
  private readonly _baseUrl = "https://raw.githubusercontent.com/AidanPelle/virtual-scroll/main/src/examples/components";

  /** Handles cleaning up subscriptions when the example-viewer component is destroyed. */
  private _onDestroy = new Subject<void>();
  
  ngOnInit() {
    // Whenever the route to a component changes, we want to reset our example viewer and render the appropriate component.
    this._route.params.pipe(takeUntil(this._onDestroy)).subscribe(params => {
      this._viewContainerRef.clear();
      this.selectedTabIndex = 0;
      const componentId = params['componentName'];
      this.loadExample(componentId);
      this.selectedExample = EXAMPLE_COMPONENTS[componentId];
      this._viewContainerRef.createComponent(this.selectedExample.component, {injector: this._injector});
      this._changeDetectorRef.markForCheck();
    });
  }
  
  /** Emits feedback to the user confirming that the copy operation occured successfully. */
  copiedToClipboard() {
    this._snackbar.open('Example copied');
  }

  /** Load the html/scss/ts raw code files for displaying the code view for our component  */
  loadExample(name: string) {
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
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
