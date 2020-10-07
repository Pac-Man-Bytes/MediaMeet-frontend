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
  public currentTrack: Media;
  public player: any;
  public reframed = false;
  public query: string;
  private client: Client;
  public connected = false;
  public clientId: string;
  public playerState: string;
  public started = false;
  @Input() roomId: string;
  public url = 'https://mediameet-backend.herokuapp.com';
  // public url = 'http://localhost:8080';

  constructor(private mediaService: MediaService) {
    this.clientId = 'id-' + new Date().getTime() + '-' + Math.random().toString(36).substr(2);
  }

  ngOnInit(): void {
    this.client = new Client();
    this.client.webSocketFactory = () => {
      return new SockJS(this.url + '/sync-websocket');
    };
    const promise = new Promise((resolve, reject) => {
      this.client.activate();
      this.client.onConnect = (frame) => {
        this.connected = true;
        this.client.subscribe('/room/state/' + this.roomId, e => {
          this.changeState(e);
        });
        this.client.subscribe('/room/videoStatus/' + this.roomId, e => {
          this.sinchronizeVideo(e);
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
        const promise1 = this.setStarted();
        promise1.then(
          () => {
            this.client.publish({
              destination: '/app/videoStatus/' +
                this.roomId, body: JSON.stringify(this.currentTrack)
            });
          }
        );
        const promise = this.playerChangeState('PLAYING');
        promise.then(
          () => {
            this.client.publish({destination: '/app/state/' + this.roomId, body: 'PLAYING ' + this.cleanTime()});
          }
        );
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

  setStarted(): Promise<any> {
    const promise = new Promise((resolve) => {
      this.started = true;
      this.currentTrack.time = this.cleanTime();
      resolve();
    });
    return promise;
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
    this.mediaService.getVideo(query).subscribe(media => {
        this.currentTrack = media;
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

  roomIdM(): void {
    console.log(this.roomId);
  }

  private sinchronizeVideo(e): void {
    const media = JSON.parse(e.body) as Media;
    if (!this.started) {
      console.log(media.id, media.time, 'large');
      this.video = media.id;
      this.player.loadVideoById(media.id, media.time, 'large');
    }
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

