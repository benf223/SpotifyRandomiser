import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  MatToolbarModule,
  MatButtonModule,
  MatCardModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { NavComponent } from './nav/nav.component';
import { ApiService } from './api.service';
import { AuthInterceptorService } from './auth-interceptor.service';

let routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 't',
    component: HomeComponent
  },
  {
    path: 'playlist/:playlistId',
    component: PlaylistComponent
  },
  {
    path: 'playlists',
    component: PlaylistsComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlaylistsComponent,
    PlaylistComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
