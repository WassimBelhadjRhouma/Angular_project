import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthService } from './service/auth.service';
import { InputService } from './utiles/input.service';
import { UserService } from './service/user.service';
import { StorageService } from './service/storage.service';
import { BearerInterceptorService } from './intercepters/bearer-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard, NotAuthGuard } from './guard/auth.guard';
import { PagesService } from './service/pages.service';


const MODULES = [

];

const SERVICES = [
  AuthService,
  InputService,
  UserService,
  StorageService,
  BearerInterceptorService,
  AuthGuard,
  NotAuthGuard,
  PagesService
];

@NgModule({
  declarations: [],
  imports: [
    ...MODULES
  ],
  providers: [
    ...SERVICES
  ]
})

export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded.Import Core modules in the AppModule only.`);
    }
  }
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: BearerInterceptorService, multi: true },
      ],
    };
  }
}
