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
  constructor(private roomService: RoomService, private router:Router) {
    this.room = new Room();
  }

  ngOnInit(): void {
  }

  createRoom(): void{
    this.roomService.createRoom(this.room).subscribe(resp => {
      swal.fire('Sala creada', resp.id, 'success');
      this.room.id = resp.id;
    });
    this.router.navigate([`rooms/${this.room.id}`]);
  }

}
