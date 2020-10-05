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

  public isError = 'false';

  ngOnInit(): void {
  }

  onLoginGoogle(): void {
    this.authService.loginGoogleUser();
    // .then();
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()).then(r => {
      this.router.navigate(['preroom']);
      console.log(firebase.auth().currentUser.uid);
    });
  }

  onLoginFacebook(): void {
    this.afAuth.signInWithPopup(new auth.FacebookAuthProvider()).then(r => {
      this.router.navigate(['preroom']);
      console.log(firebase.auth().currentUser.uid);
    });
  }

  onLogout(): void {
    this.afAuth.signOut();
  }
}
