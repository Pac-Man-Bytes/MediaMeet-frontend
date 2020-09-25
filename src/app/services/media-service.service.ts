import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import swal from 'sweetalert2';
import {catchError, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import { Media } from '../models/media';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class MediaService {
  urlEndPoint = 'http://localhost:8080/api/media/youtube';
  constructor(private http: HttpClient, private router: Router) { }
  getVideo(query: string): Observable<Media> {
    return this.http.get<Media>(`${this.urlEndPoint}/${query}`).pipe(
      catchError(e => {
        if (e.status === 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }
}
