import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import reframe from 'reframe.js';
import {Media} from '../../clases/media';
import {MediaService} from '../../services/media.service';
import * as SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import {timeout} from 'rxjs/operators';
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
  public YT: any;
  public video = '';
  public currentTrack = new Media();
  public player: any;
  public reframed = false;
  public query: string;
  private client: Client;
  public connected = false;
  public clientId: string;
  public playerState: string;
  public started = false;
  public videos = [];
  @Input() roomId: string;
  // public url = 'https://mediameet-backend.herokuapp.com';
  public url = 'http://localhost:8080';
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
        this.client.subscribe('/room/next/' + this.roomId, e => {
          this.putNextSong(e);
        });
        this.client.subscribe('/room/queue/' + this.roomId, e => {
          this.synchronizeQueue(e);
        });
        this.client.subscribe('/room/queue/' + this.roomId + '/playlists', e => {
          this.synchronizeQueue(e);
        });
        this.client.subscribe('/room/queue/' + this.roomId + '/playlist', e => {
          this.synchronizeQueue(e);
        });
        this.client.subscribe('/room/videoStatus/' + this.roomId, e => {
          this.synchronizeVideo(e);
        });
        this.client.subscribe('/room/currentTime/' + this.roomId, e => {
          this.videoFetch(e);
        });
        this.client.subscribe('/room/fetch/' + this.roomId, e => {
          this.fetch(e);
        });
        this.client.publish({destination: '/app/queue/' + this.roomId + '/playlist', body: null});
        this.client.publish({destination: '/app/fetch/' + this.roomId, body: null});
      };
    });
    promise.then(
      (val) => console.log(val)
    );
    this.init();
    this.initPlayer();
  }
  init(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
  initPlayer(): void {
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
              try {
                reframe(e.target.a);
              } catch (e) {
              }
            }
          }
        }
      });
    };
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
        this.next();
        break;
    }
  }
  setStarted(): Promise<any> {
    const promise = new Promise((resolve) => {
      this.started = true;
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
  onEnter(query: string): Promise<any> {
    const promise = new Promise<any>(resolve => {
      this.mediaService.getVideo(query).subscribe(media => {
        if (!this.started) {
          if (this.videos.length === 0) {
            this.client.publish({
              destination: '/app/videoStatus/' +
                this.roomId, body: JSON.stringify(media)
            });
          } else {
            this.next();
          }
        } else {
          this.client.publish({destination: '/app/queue/' + this.roomId, body: JSON.stringify(media)});
        }
      });
      resolve();
    });
    return promise;
  }
  timeOut(): Promise<any> {
    if (this.currentTrack) {
      this.player.pauseVideo();
    }
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        this.currentTrack = this.videos.shift();
        resolve();
      }, 50);
    });
    return promise;
  }
  next(): void {
    const timeOut = this.timeOut();
    timeOut.then(
      () => {
        this.client.publish({destination: '/app/next/' + this.roomId, body: JSON.stringify(this.currentTrack)});
        this.client.publish({destination: '/app/queue/' + this.roomId + '/playlists', body: JSON.stringify(this.videos)});
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
  private synchronizeVideo(e): void {
    const track = JSON.parse(e.body) as Media;
    if (!this.started) {
      this.currentTrack = track;
      this.video = track.id;
      this.player.loadVideoById(track.id, track.time, 'large');
    }
  }
  private putNextSong(e): void {
    const media = JSON.parse(e.body) as Media;
    this.currentTrack = media;
    this.video = media.id;
    this.player.loadVideoById(media.id, media.time, 'large');
  }
  private videoFetch(e): void {
    const promise = new Promise( resolve => {
      setTimeout( () =>{
        resolve();
      }, 500);
    });
    promise.then(
      () => {
        const media = JSON.parse(e.body) as Media;
        this.currentTrack = media;
        this.video = media.id;
        this.player.loadVideoById(media.id, media.time, 'large'); }
    );
  }
  private synchronizeQueue(e): void {
    const queue = JSON.parse(e.body) as Media[];
    this.videos = queue;
  }
  private fetch(e): void{
    if (this.started){
      this.currentTrack.time = this.cleanTime();
      this.client.publish({destination: '/app/currentTime/' + this.roomId, body: JSON.stringify(this.currentTrack)});
    }
  }
  private changeState(e): void {
    console.log(e.body.split(' ')[0], this.playerState);
    if (e.body.split(' ')[0] === 'PLAYING' && this.playerState === 'PAUSED') {
      this.player.playVideo();
      this.player.seekTo(e.body.split(' ')[1], true);
    } else if (e.body.split(' ')[0] === 'PAUSED' && this.playerState === 'PLAYING') {
      this.player.pauseVideo();
    }
  }

  ngOnDestroy(): void {
    this.client.onDisconnect = (frame) => {
      this.client.deactivate();
    };
  }
}

