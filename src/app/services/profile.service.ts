import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Profile} from '../clases/profile';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {Room} from '../clases/room';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  // public urlEndPoint = 'http://localhost:8080/api/profiles';
  urlEndPoint = 'https://mediameet-backend.herokuapp.com/api/profiles';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router: Router) {
  }

  createProfile(profile: Profile): Observable<Profile> {
    return this.http.post<Profile>(this.urlEndPoint, profile, {headers: this.httpHeaders});
  }

  getProfile(id: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status === 404) {
          return null;
        }
        console.error(e.error.mensaje);
        // swal.fire(e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  addProfileRoom(id: string, room: Room): Observable<unknown> {
    return this.http.patch<unknown>(`${this.urlEndPoint}/profile/${id}`, room, {headers: this.httpHeaders});
  }
}
