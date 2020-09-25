import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatComponent } from './chat/chat.component';
import {MediaService} from './services/media-service.service';
import { RoomComponent } from './room/room.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {path: 'room', component: RoomComponent},
    {path: 'chat', component: ChatComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    ChatComponent,
    RoomComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [MediaService],
  bootstrap: [AppComponent],

})
export class AppModule { }
