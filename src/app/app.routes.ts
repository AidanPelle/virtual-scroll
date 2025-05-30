import { Routes } from '@angular/router';
import { DemoViewerComponent } from '../demo/demo-viewer/demo-viewer.component';
import { HomePageComponent } from '../home-page/home-page.component';

export const routes: Routes = [
    {path: '', redirectTo: 'overview', pathMatch: 'full'},
    {path: 'overview', component: HomePageComponent },
    {
        path: 'demo/:componentId',
        component: DemoViewerComponent,
    }
];
