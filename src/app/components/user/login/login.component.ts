import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';
import {Router} from '@angular/router';
import * as firebase from 'firebase';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth, private router: Router, private authService: AuthService) {
  }

  public isError = false;
  public email = '';
  public passwd = '';

  ngOnInit(): void {
  }

  onLogin(): void {
    this.authService.loginEmailUser(this.email, this.passwd)
      .then((res) => {
        console.log('resUser', res);
        this.router.navigate(['preroom']);
        console.log(firebase.auth().currentUser.uid);
      }).catch(err => console.log('Error', err));
  }

  onLoginGoogle(): void {
    this.authService.loginGoogleUser()
      .then((res) => {
        console.log('resUser', res);
        this.router.navigate(['preroom']);
        console.log(firebase.auth().currentUser.uid);
      }).catch(err => console.log('Error', err));
  }

  onLoginFacebook(): void {
    this.authService.loginFacebookUser()
      .then((res) => {
        console.log(firebase.auth().currentUser.uid);
        this.router.navigate(['preroom']);
      }).catch(err => console.log('Error', err));
  }


  onLogout(): void {
    this.authService.logoutUser();
    this.router.navigate(['']);
  }
}
