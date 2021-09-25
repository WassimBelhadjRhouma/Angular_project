import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LoginComponent,
  SignupComponent,
  EmailConfirmationComponent,
  AuthComponent,
  AskResetPasswordComponent,
  ResetPasswordComponent
} from '.';
import { AuthRoutingModule } from './auth-routing.module';
import { BlockCopyPasteDirective } from '../shared/directive/block-copy-paste.directive';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

const COMPONENTS = [
  AuthComponent,
  LoginComponent,
  SignupComponent,
  EmailConfirmationComponent,
  BlockCopyPasteDirective,
  AskResetPasswordComponent,
  ResetPasswordComponent
];
const MODULES = [
  CommonModule,
  AuthRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  SocialLoginModule
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    ...MODULES
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '795997433696-1hg6gc66oq00o6cv4cp7obs98dk5r3k5.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('4408178812559025')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ]
})
export class AuthModule { }
