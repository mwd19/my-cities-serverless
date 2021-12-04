import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlacesComponent } from './places/places.component';
import { PlaceEditComponent } from './places/place-edit.component';
import { ProfileComponent } from './profile/profile.component';

import { AuthGuard } from '@auth0/auth0-angular';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'places', component: PlacesComponent, canActivate: [AuthGuard] },
  { path: 'place/:id', component: PlaceEditComponent, canActivate: [AuthGuard] },
  { path: 'place', component: PlaceEditComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
