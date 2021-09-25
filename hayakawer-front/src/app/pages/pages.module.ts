// import 'flatpickr/dist/flatpickr.css';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import {
  PagesComponent,
  LandingPageComponent,
  ProfileComponent,
  HomeComponent,
  AddTerrainComponent,
  AddEventComponent,
  UsersComponent,
  TerrainComponent,
  EventComponent,
  TerrainDetailComponent,
  OwnerCalendarComponent
} from '.';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from '../shared/component/loader/loader.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { GoogleMapsModule } from '@angular/google-maps';
import { PopoverComponent } from './profile/popover/popover.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxEchartsModule } from 'ngx-echarts';

const MODULES = [
  GoogleMapsModule,
  CommonModule,
  PagesRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  NgbModule,
  Ng2SmartTableModule,
  NgxPaginationModule,
  NgbModalModule,
  FlatpickrModule.forRoot(),
  CalendarModule.forRoot({
    provide: DateAdapter,
    useFactory: adapterFactory,
  }),
  NgxEchartsModule.forRoot({
    echarts: () => import('echarts'),
  }),
];

const COMPONENTS = [
  PagesComponent,
  LandingPageComponent,
  HomeComponent,
  ProfileComponent,
  LoaderComponent,
  ProfileComponent,
  AddTerrainComponent,
  AddEventComponent,
  UsersComponent,
  TerrainComponent,
  EventComponent,
  PopoverComponent,
  TerrainDetailComponent,
  OwnerCalendarComponent
];


@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    ...MODULES
  ]
})
export class PagesModule { }
