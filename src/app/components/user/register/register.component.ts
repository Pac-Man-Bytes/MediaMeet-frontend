import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {ProfileService} from '../../../services/profile.service';
import {Profile} from '../../../clases/profile';
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

  constructor(private authService: AuthService, private router: Router, private profileService: ProfileService) {
  }

  ngOnInit(): void {
  }

  onUserRegister(): void {
    this.authService.registerUser(this.email, this.passwd)
      .then((res) => {
        const profile = new Profile();
        profile.id = firebase.auth().currentUser.uid;
        profile.nickname = firebase.auth().currentUser.displayName;
        this.profileService.createProfile(profile);
        this.router.navigate(['/']);
      }).catch(error => {
      this.errorMssg = error;
    });
  }

}
