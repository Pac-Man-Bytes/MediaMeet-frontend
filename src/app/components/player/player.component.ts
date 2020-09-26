import {Component, OnInit, Input} from '@angular/core';
import reframe from 'reframe.js';
import {Media} from '../../clases/media';
import {MediaService} from '../../services/media.service';

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

  constructor(private mediaService: MediaService) {
  }

  ngOnInit(): void {
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
    console.log(event);
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        if (this.cleanTime() === 0) {
          console.log('started ' + this.cleanTime());
        } else {
          console.log('playing ' + this.cleanTime());
        }
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() !== 0) {
          console.log('paused' + ' @ ' + this.cleanTime());
        }
        break;
      case window['YT'].PlayerState.ENDED:
        console.log('ended ');
        break;
    }
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
}

