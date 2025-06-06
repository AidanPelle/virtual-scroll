import { Routes } from '@angular/router';
import { HomePageComponent } from '../home-page/home-page.component';
import { ExampleViewerComponent } from '../examples/example-viewer/example-viewer.component';

export const routes: Routes = [
    {path: '', redirectTo: 'overview', pathMatch: 'full'},
    {path: 'overview', component: HomePageComponent },
    {
        path: 'examples/:componentName',
        component: ExampleViewerComponent,
    }
];
