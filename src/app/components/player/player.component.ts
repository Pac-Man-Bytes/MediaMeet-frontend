import {Component, OnInit, Input} from '@angular/core';
import reframe from 'reframe.js';
import {Media} from '../../clases/media';
import {MediaService} from '../../services/media.service';
import * as SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  public YT: any;
  public video = '';
  public media: Media;
  public player: any;
  public reframed = false;
  public query: string;
  private client: Client;
  public connected = false;
  public clientId: string;
  public playerState: string;
  public started: boolean;
  @Input() roomId: string;
  constructor(private mediaService: MediaService) {
    this.clientId = 'id-' + new Date().getTime() + '-' + Math.random().toString(36).substr(2);
  }
  ngOnInit(): void {
    this.client = new Client();
    this.client.webSocketFactory = () => {
      return new SockJS('http://localhost:8080/sync-websocket');
    };
    const promise = new Promise((resolve, reject) => {
      this.client.activate();
      this.client.onConnect = (frame) => {
        this.connected = true;
        this.client.subscribe('/room/state/' + this.roomId, e => {
          this.changeState(e);
        });
      };
    });
    promise.then(
      (val) => console.log(val)
    );
    this.init();
    window['onYouTubeIframeAPIReady'] = (e) => {
      this.YT = window['YT'];
      this.reframed = false;
      this.player = new window['YT'].Player('player', {
        videoId: this.video,
        events: {
          onStateChange: this.onPlayerStateChange.bind(this),
          onError: this.onPlayerError.bind(this),
          onReady: (e) => {
            if (!this.reframed) {
              this.reframed = true;
              reframe(e.target.a);
            }
          }
        }
      });
    };
  }
  init(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
  onPlayerStateChange(event): void {
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        if (this.cleanTime() === 0) {
          console.log("si");
        } else {
          const promise = this.playerChangeState('PLAYING');
          promise.then(
            () => {
              this.client.publish({destination: '/app/state/' + this.roomId, body: 'PLAYING ' + this.cleanTime()});
            }
          );
          console.log('playing ' + this.cleanTime());
        }
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() !== 0) {
          const promise = this.playerChangeState('PAUSED');
          promise.then(
            () => {
              this.client.publish({destination: '/app/state/' + this.roomId, body: 'PAUSED ' + this.cleanTime()});
            }
          );
        }
        break;
      case window['YT'].PlayerState.ENDED:
        console.log('ended ');
        break;
    }
  }

  playerChangeState(state): Promise<any> {
    const promise = new Promise((resolve) => {
      this.playerState = state;
      resolve();
    });
    return promise;
  }

  cleanTime(): number {
    return Math.round(this.player.getCurrentTime());
  }
  onPlayerError(event): void {
    switch (event.data) {
      case 2:
        console.log('' + this.video);
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    }
  }

  onEnter(query: string): void {
    console.log(query);
    this.mediaService.getVideo(query).subscribe(media => {
        console.log(media);
        this.video = media.id;
        this.player.loadVideoById(media.id, 0, 'large');
      }
    );
  }

  connect(): void {
    this.client.activate();
  }

  disconnect(): void {
    this.client.deactivate();
  }
  roomIdM(): void{
    console.log(this.roomId);
  }
  private changeState(e): void {
    console.log(e.body.split(' ')[0], this.playerState);
    if (e.body.split(' ')[0] === 'PLAYING' && this.playerState === 'PAUSED') {
      this.player.playVideo();
    } else if (e.body.split(' ')[0] === 'PAUSED' && this.playerState === 'PLAYING') {
      this.player.pauseVideo();
    }
  }
}

