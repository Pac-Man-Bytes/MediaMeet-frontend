import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatComponent } from './chat/chat.component';
import { MainComponent } from './main/main.component';
import {MediaService} from './services/media-service.service';
import { LoginComponent } from './login/login.component';
import {RouterModule, Routes} from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterComponent } from './register/register.component';
import {FormsModule} from '@angular/forms';
const routes: Routes = [
  {path: 'user/login', component: LoginComponent},
  {path: 'user/register', component: RegisterComponent},
  {path: 'player', component: PlayerComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    ChatComponent,
    MainComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [MediaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
