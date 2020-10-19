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
  public errorMssg = '';
  public email = '';
  public passwd = '';

  ngOnInit(): void {
  }

  onLogin(): void {
    this.afAuth.setPersistence('local').then(_ => {
      this.authService.loginEmailUser(this.email, this.passwd)
        .then((res) => {
          console.log('resUser', res);
          this.router.navigate(['preroom']);
          console.log(firebase.auth().currentUser.uid);
        }).catch(err => {
        this.isError = true;
        this.errorMssg = err;
      });
    });

  }

  onLoginGoogle(): void {
    this.authService.loginGoogleUser()
      .then((res) => {
        console.log('resUser', res);
        this.router.navigate(['preroom']);
        console.log(firebase.auth().currentUser.uid);
      }).catch(err => {
      this.isError = true;
      this.errorMssg = err;
    });
  }

  onLoginFacebook(): void {
    this.authService.loginFacebookUser()
      .then((res) => {
        console.log(firebase.auth().currentUser.uid);
        this.router.navigate(['preroom']);
      }).catch(err => {
      this.isError = true;
      this.errorMssg = err;
    });
  }

  onLoginGitHub(): void {
    this.authService.loginGitHubUser()
      .then((res) => {
        console.log(firebase.auth().currentUser.uid);
        this.router.navigate(['preroom']);
      }).catch(err => {
      this.isError = true;
      this.errorMssg = err;
    });
  }


  onLogout(): void {
    this.authService.logoutUser();
    this.router.navigate(['']);
  }
}
