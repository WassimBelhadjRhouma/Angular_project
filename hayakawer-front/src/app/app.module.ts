import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgxFontAwesomeModule } from 'ngx-font-awesome';
import { ToastrModule } from 'ngx-toastr';


const MODULE = [
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule, // required animations module
  CoreModule.forRoot(),
  ToastrModule.forRoot(),
  NgbModule,
  HttpClientModule,
  NgxFontAwesomeModule,
];


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ...MODULE,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
