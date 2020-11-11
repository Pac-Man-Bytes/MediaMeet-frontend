import {Component, OnInit} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {Room} from '../../clases/room';
import swal from 'sweetalert2';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {ProfileService} from '../../services/profile.service';
import Swal from 'sweetalert2';
import * as firebase from 'firebase';
import {Profile} from '../../clases/profile';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  room: Room;
  cRoom: Room;
  errorGet: string;
  UDI: string;
  UName: string;
  profile: Profile;

  constructor(private roomService: RoomService, private router: Router, private oAuth: AngularFireAuth, private profileServices: ProfileService) {
    this.room = new Room();
    this.cRoom = new Room();
  }

  ngOnInit(): void {
    this.registerProfile();
  }

  redirectToRoom(roomId): void {
    this.router.navigate(['/room', roomId]);
  }

  createRoom(): void {
    this.profileServices.getProfile(firebase.auth().currentUser.uid).subscribe(res => {
        console.log('chi');
        console.log(res);
      },
      error => {
        console.log(error);
      });
    this.roomService.createRoom(this.cRoom).subscribe(resp => {
      swal.fire('Sala creada', resp.id, 'success');
      this.cRoom.id = resp.id;
      this.redirectToRoom(this.cRoom.id);
    });
  }

  getRoom(): void {
    this.roomService.getRoom(this.room.id).subscribe(resp => {
        swal.fire('Te has unido a', resp.name, 'success');
        this.redirectToRoom(this.room.id);
      },
      error => {
        console.log(error);
        this.errorGet = error.error.message as string;
      }
    );
  }

  getUID(): void {
    console.log(firebase.auth().currentUser);
  }

  registerProfile(): void {
    const currentUser = firebase.auth().currentUser;
    this.profile = new Profile();
    this.profile.id = currentUser.uid;
    this.profile.nickname = currentUser.displayName;
    this.profile.photo = currentUser.photoURL;
    this.profile.rooms = [];
    this.profileServices.createProfile(this.profile).subscribe(resp => {
      },
      error => {
        console.log(error);
        this.errorGet = error.error.message as string;
      });
  }
}
