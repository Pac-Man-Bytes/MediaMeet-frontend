import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public email: string = '';
  public passwd: string = '';
  public errorMssg: string = '';
  public isError: boolean;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  onUserRegister(): void {
    this.authService.registerUser(this.email, this.passwd)
      .then((res) => {
        this.router.navigate(['/']);
      }).catch(error => {
      this.errorMssg = error;
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

}
