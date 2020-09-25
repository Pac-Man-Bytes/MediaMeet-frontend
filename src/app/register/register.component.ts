import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor() {
  }

  public email: string = '';
  public password: string = '';

  ngOnInit(): void {
  }

  onAddUser(): void {
  }

  onLoginFacebook(): void {
  }

  onLoginGoogle(): void {
  }
}
