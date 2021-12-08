import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { PlacesComponent } from './places/places.component';
import { PlaceEditComponent } from './places/place-edit.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthModule, AuthHttpInterceptor } from '@auth0/auth0-angular';
import { environment as env } from '../environments/environment';
import { AuthButtonComponent } from './auth-button/auth-button.component'
import { LogoutButtonComponent } from './logout-button/logout-button.component'
import { LoadingComponent } from './loading/loading.component'
import { ProfileComponent } from './profile/profile.component';
import { TokenInterceptor } from './auth/token.interceptor';

import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { GMapModule } from 'primeng/gmap';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    PlacesComponent,
    PlaceEditComponent,
    AuthButtonComponent,
    LogoutButtonComponent,
    LoadingComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    // Import the module into the application, with configuration
    AuthModule.forRoot({
      ...env.auth,
      httpInterceptor: {
        allowedList: [{
          uri: `${env.dev.serverUrl}` + '*',
          tokenOptions: {
            scope: 'read:current_user'
          }
        }]
      },
    }),
    DataViewModule,
    PanelModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    GMapModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
