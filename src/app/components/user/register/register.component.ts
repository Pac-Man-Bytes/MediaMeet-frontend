import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public email: string = '';
  public passwd: string = '';
  public errorMssg: string = '';

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

}
