import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PlayerComponent} from '../player/player.component';
import {QueueService} from './queue/queue.service';
import {RoomService} from '../../services/room.service';
import {ProfileService} from '../../services/profile.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  public roomId;
  public p = 1;
  modalOpen: boolean;
  inputVideo: string;
  errorGet: string;
  @ViewChild('videoI') videoI: ElementRef;
  @Output() pageChange: EventEmitter<number>;
  @Output() pageBoundsCorrection: EventEmitter<number>;
  @ViewChild(PlayerComponent, {static: true}) player: PlayerComponent;
  constructor(private route: ActivatedRoute, private queueService: QueueService,
              private roomServices: RoomService, private profileService: ProfileService) {
    this.route.params.subscribe(params => {
      this.roomId = params['roomId'];
    });
  }
  ngOnInit(): void {
    this.addMember();
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
  onEnter(query): void{
    this.player.onEnter(query);
    this.videoI.nativeElement.value = '';
  }
  addMember(): void{
    this.profileService.getProfile(firebase.auth().currentUser.uid).subscribe(profile => {
      this.roomServices.addRoomMember(this.roomId, profile).subscribe(res => {
        this.roomServices.getRoom(this.roomId).subscribe(room => {
         this.profileService.addProfileRoom(profile.id, room).subscribe(y =>{
          });
        });
      });
    }, error => {
      console.log(error);
      this.errorGet = error.error.message as string;
    });

  }

}
