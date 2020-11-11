import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PlayerComponent} from '../player/player.component';
import {QueueService} from './queue/queue.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  public roomId;
  public p = 1;
  modalOpen: boolean;
  @Output() pageChange: EventEmitter<number>;
  @Output() pageBoundsCorrection: EventEmitter<number>;
  @ViewChild(PlayerComponent, {static: true}) player: PlayerComponent;
  constructor(private route: ActivatedRoute, private queueService: QueueService) {
    this.route.params.subscribe(params => {
      this.roomId = params['roomId'];
    });
  }
  ngOnInit(): void {
  }
  onChatChange(message): void {
    if (message.substr(0, 8).toLowerCase() === '/youtube' && message.substr(9) !== '') {
        this.player.onEnter(message.substr(9));
    }
    if (message.substr(0, 5).toLowerCase() === '/next' && (message.substr(6) === '' || message.substr(6) === ' ' )) {
        this.player.next();
    }
    if (message.substr(0, 5).toLowerCase() === '/play' && (message.substr(6) !== '')) {
      this.player.onEnter(message.substr(6));
    }
  }
  abrirModal(): void{
    this.queueService.abrirModal();
    this.modalOpen = true;
  }

}
