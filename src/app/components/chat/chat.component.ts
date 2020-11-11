import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import * as SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import {Message} from '../../clases/message';
import * as firebase from 'firebase';
import {ProfileService} from '../../services/profile.service';
import {Profile} from '../../clases/profile';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private client: Client;
  public sending: boolean;
  public connected: boolean;
  public message: Message = new Message();
  public messages: Message[] = [];
  public profile: Profile = new Profile();
  @Output() private onChange: EventEmitter<string> = new EventEmitter<string>();
  // public url = 'https://mediameet-backend.herokuapp.com';
  public url = 'http://localhost:8080';
  public writing: string;
  @Input() roomId: string;

  constructor(private profileServices: ProfileService) {
    this.profile = new Profile();
  }

  ngOnInit(): void {
    this.setMessageUser();
    this.client = new Client();
    this.client.webSocketFactory = () => {
      return new SockJS(this.url + '/sync-websocket');
    };

    this.client.onConnect = (frame) => {
      this.connected = true;

      this.client.subscribe('/room/chat/' + this.roomId, e => {
        this.listenMessages(e);
      });
      this.client.subscribe('/room/chat/' + this.roomId + '/writing', e => {
        this.writing = e.body;
        setTimeout(() => this.writing = '', 3000);
      });

      this.client.subscribe('/room/chat/' + this.roomId + '/history', e => {
        const promise1 = new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 50);
        });
        promise1.then(
          () => {
            const history = JSON.parse(e.body) as Message[];
            this.messages = history.map(m => {
              m.date = new Date();
              return m;
            });
          }
        );
      });
      this.client.publish({destination: '/app/chat/' + this.roomId + '/history', body: firebase.auth().currentUser.uid});
      this.message.type = 'NEW_USER';

      const promise = new Promise(resolve => {
        resolve();
      });
      promise.then(
        () => {
          this.client.publish({destination: '/app/chat/' + this.roomId, body: JSON.stringify(this.message)});
        }
      );
    };
    this.client.onDisconnect = (frame) => {
      this.connected = false;
      this.message = new Message();
      this.messages = [];
    };
    this.client.activate();
  }

  private listenMessages(e): void {
    console.log(e.body);
    const message: Message = JSON.parse(e.body) as Message;
    message.date = new Date(message.date);

    if (!this.message.color && message.type === 'NEW_USER' && this.message.username === message.username) {
      this.message.color = message.color;
    }
    if (message.text.substr(0, 1) === '/') {
      this.onChange.emit(message.text);
    }
    this.messages.push(message);
  }

  connect(): void {
    this.client.activate();
  }

  disconnect(): void {
    this.client.deactivate();
  }

  writingEvent(): void {
    this.client.publish({destination: '/app/chat/' + this.roomId + '/writing', body: this.message.username});
  }

  sendMessage(): void {

    const promise = new Promise(resolve => {
      resolve();
    });
    promise.then(
      () => {
        this.message.type = 'MESSAGE';
        this.client.publish({destination: '/app/chat/' + this.roomId, body: JSON.stringify(this.message)});
        this.message.text = '';
      }
    );
  }

  ngOnDestroy(): void {
    this.client.deactivate();
  }

  private setMessageUser(): void {
    this.profileServices.getProfile(firebase.auth().currentUser.uid).subscribe(res => {
        this.profile.nickname = res.nickname;
        this.profile.photo = res.photo;
        this.profile.id = res.id;
        this.message.username = this.profile.nickname;
        this.message.profile = this.profile;
        this.message.date = new Date();
      },
      error => {
        console.log(error);
      });
  }
}
