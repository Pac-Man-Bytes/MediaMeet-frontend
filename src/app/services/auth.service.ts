import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private oAuth: AngularFireAuth) {
  }

  registerUser(): void {
  }

  loginUser(): void {
  }

  loginEmailUser(email: string, passwd: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.oAuth.signInWithEmailAndPassword(email, passwd)
        .then(userData => resolve(userData),
          err => reject(err));
    });
  }


  loginFacebookUser(): Promise<firebase.auth.UserCredential> {
    return this.oAuth.setPersistence('session').then(_ => {
      return this.oAuth.signInWithPopup(new auth.FacebookAuthProvider());
    });
  }

  loginGoogleUser(): Promise<firebase.auth.UserCredential> {
    return this.oAuth.setPersistence('session').then(_ => {
      return this.oAuth.signInWithPopup(new auth.GoogleAuthProvider());
    });
  }

  logoutUser(): void {
    this.oAuth.signOut();
  }

// check if user is logged
  isAuth(): Observable<firebase.User> {
    return this.oAuth.authState.pipe(map(auth => auth));
  }
}
