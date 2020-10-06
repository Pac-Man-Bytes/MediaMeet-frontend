import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/user/login/login.component';
import {RegisterComponent} from './components/user/register/register.component';
import {RoomComponent} from './components/room/room.component';
import {Page404Component} from './components/page404/page404.component';

const routes: Routes = [

  {path: '', component: LoginComponent},
  {path: 'preroom', component: HomeComponent},
  {path: 'room/:roomId', component: RoomComponent}, // TODO, only users auth
  {path: 'user/register', component: RegisterComponent},
  {path: '**', component: Page404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
