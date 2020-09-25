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
// Services
import {DataAPIService} from './services/data-api.service';

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
    AppRoutingModule
  ],
  providers: [DataAPIService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
