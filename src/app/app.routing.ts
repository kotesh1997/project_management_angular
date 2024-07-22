import { Route } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';

export const appRoutes: Route[] = [

    { path: '', pathMatch: 'full', redirectTo: 'projects' },

    {
        path: '',
        component: LayoutComponent,

        children: [
            { path: '', loadChildren: () => import('app/modules/pages/pages.module').then(m => m.PagesModule) },

        ]
    }
];
