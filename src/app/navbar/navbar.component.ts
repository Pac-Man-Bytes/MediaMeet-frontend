import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() {
  }

  public appName: String = 'MediaMeet';
  public isLogged: boolean = false;

  ngOnInit(): void {
  }

}
