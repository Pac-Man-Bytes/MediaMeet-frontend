import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PlayerComponent} from "../player/player.component";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  public roomId;
  public p = 1;
  @Output() pageChange: EventEmitter<number>;
  @Output() pageBoundsCorrection: EventEmitter<number>;
  @ViewChild(PlayerComponent, {static: true}) player: PlayerComponent;
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.roomId = params['roomId'];
    });
  }
  ngOnInit(): void {
  }

}
