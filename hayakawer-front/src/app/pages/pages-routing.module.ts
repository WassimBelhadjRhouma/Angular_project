import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PagesComponent,
  HomeComponent,
  AddTerrainComponent,
  ProfileComponent,
  UsersComponent,
  AddEventComponent,
  TerrainDetailComponent,
  OwnerCalendarComponent
} from '.';
import { EventComponent } from './event/event.component';
import { TerrainComponent } from './terrain/terrain.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'home'
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'terrain',
        component: TerrainComponent,
      },
      {
        path: 'event',
        component: EventComponent,
      },
      {
        path: 'terrain/add',
        component: AddTerrainComponent,
      },
      { path: 'terrain/detail/:id', component: TerrainDetailComponent },

      {
        path: 'event/add',
        component: AddEventComponent,
      },
      {
        path: 'terrain/calendar/:id',
        component: OwnerCalendarComponent,
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
