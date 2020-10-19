import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import * as SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import {Message} from '../../clases/message';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private client: Client;
  public sending: boolean;
  public connected: boolean;
  public message: Message = new Message();
  public messages: Message[] = [];
  // public url = 'https://mediameet-backend.herokuapp.com';
  public url = 'http://localhost:8080';
  public writing: string;
  @Input() roomId: string;

  constructor() {
  }

  ngOnInit(): void {
    this.message.username = firebase.auth().currentUser.uid;
    console.log(firebase.auth().currentUser.uid);
    console.log(firebase.auth().currentUser.displayName);
    console.log(this.roomId);
    this.client = new Client();
    this.client.webSocketFactory = () => {
      return new SockJS(this.url + '/sync-websocket');
    };

    this.client.onConnect = (frame) => {
      console.log('Conectados ? ' + this.client.connected + ' : ' + frame);
      this.connected = true;

      this.client.subscribe('/room/chat' + this.roomId, e => {
        this.listenMessages(e);
      });
      this.client.subscribe('/room/chat/writing' + this.roomId, e => {
        this.writing = e.body;
        setTimeout(() => this.writing = '', 2500);
      });
    };
    this.client.onDisconnect = (frame) => {
      console.log('Conectados ? ' + this.client.connected + ' : ' + frame);
      this.connected = false;
      this.message = new Message();
      this.messages = [];
    };
    this.client.activate();
  }

  private listenMessages(e): void {
    let message: Message = JSON.parse(e.body) as Message;
    message.date = new Date(message.date);
    if (!this.message.color && message.type == 'NEW_USER' && this.message.username == message.username) {
      this.message.color = message.color;
    }
    this.messages.push(message);
  }

  conectar() {
    this.client.activate();
  }

  desconectar() {
    this.client.deactivate();
  }

  sendMessage(): void {
    this.message.type = 'MESSAGE';
    this.client.publish({destination: '/app/chat' + this.roomId, body: JSON.stringify(this.message)});
    this.message.text = '';
  }

  ngOnDestroy(): void {
    this.client.deactivate();
  }

}
