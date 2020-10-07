import { Component, OnInit } from '@angular/core';
import {RoomService} from '../../services/room.service';
import {Room} from '../../clases/room';
import swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  room: Room;
  cRoom: Room;
  errorGet: string;
  constructor(private roomService: RoomService, private router: Router) {
    this.room = new Room();
    this.cRoom = new Room();
  }

  ngOnInit(): void {
  }
  redirectToRoom(roomId): void{
    this.router.navigate([ '/room', roomId]);
  }

  createRoom(): void{
    this.roomService.createRoom(this.cRoom).subscribe(resp => {
      swal.fire('Sala creada', resp.id, 'success');
      this.cRoom.id = resp.id;
      this.redirectToRoom(this.cRoom.id);
    });
  }
  getRoom(): void{
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

}
