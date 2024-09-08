import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '**',
    loadComponent: () =>
      import('./supertokens.component').then((m) => m.SupertokensComponent),
  },
];
