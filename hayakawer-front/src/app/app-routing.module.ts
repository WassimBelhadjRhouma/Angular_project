import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotAuthGuard, AuthGuard } from './core/guard/auth.guard';
import { LandingPageComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(auth => auth.AuthModule),
    canActivate: [NotAuthGuard]
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(auth => auth.PagesModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'pages',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'pages',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
