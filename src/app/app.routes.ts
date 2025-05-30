import { Routes } from '@angular/router';
import { DemoViewerComponent } from './demo/demo-viewer/demo-viewer.component';

export const routes: Routes = [
    {
        path: 'demo/:componentId',
        component: DemoViewerComponent,
    }
];
