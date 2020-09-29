import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  public roomId;
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.roomId = params['roomId'];
    });
  }
  ngOnInit(): void {
  }

}
