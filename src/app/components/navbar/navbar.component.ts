import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService, private oAuth: AngularFireAuth) {
  }

  public nombreApp = 'MediaMeet';
  public isLogged = false;

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        console.log('Logged :D');
        this.isLogged = true;
      } else {
        console.log('Not Logged :C');
        this.isLogged = false;
      }
    });
  }

  onLogout(): void {
    this.oAuth.signOut();
  }

}
