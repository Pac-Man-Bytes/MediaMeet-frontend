import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {RoomComponent} from './components/room/room.component';
import {PlayerComponent} from './components/player/player.component';
import {LoginComponent} from './components/user/login/login.component';
import {RegisterComponent} from './components/user/register/register.component';
import {Page404Component} from './components/page404/page404.component';
import {ChatComponent} from './components/chat/chat.component';
import {FormsModule} from '@angular/forms';
// Services
import {MediaService} from './services/media.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    RoomComponent,
    PlayerComponent,
    LoginComponent,
    RegisterComponent,
    Page404Component,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatInputModule
  ],
  providers: [MediaService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {
}
