import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Room} from '../clases/room';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  curlEndPoint = 'http://localhost:8080/api/rooms';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient, private router: Router) {
  }
  createRoom(room: Room): Observable<Room>{
    return this.http.post<Room>(this.curlEndPoint, room, {headers: this.httpHeaders});
  }
}
