import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Room} from '../clases/room';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  curlEndPoint = 'http://localhost:8080/api/rooms';
  // curlEndPoint = 'https://mediameet-backend.herokuapp.com/api/rooms';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router: Router) {
  }

  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.curlEndPoint, room, {headers: this.httpHeaders});
  }

  getRoom(id: string): Observable<Room> {
    return this.http.get<Room>(`${this.curlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status === 400) {
          return throwError(e);
        }
        swal.fire(e.error.message, `No existe una sala con id ${id}`, 'error');
        return throwError(e);
      })
    );
  }
}
