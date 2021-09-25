import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  LoginComponent, SignupComponent, EmailConfirmationComponent, AuthComponent,
  AskResetPasswordComponent, ResetPasswordComponent
} from '.';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'ask-reset-password',
        component: AskResetPasswordComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'confirm-email',
        component: EmailConfirmationComponent
      },

      // {
      //   path: '**',
      //   redirectTo: 'login'
      // }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
