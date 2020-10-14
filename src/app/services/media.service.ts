import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Media} from '../clases/media';
import {Router} from '@angular/router';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  // public urlEndPoint = 'https://mediameet-backend.herokuapp.com/api/media/youtube';
  public urlEndPoint = 'http://localhost:8080/api/media/youtube';
  constructor(private http: HttpClient, private router: Router) {}
  getVideo(query: string): Observable<Media> {
    const text = '?query='.concat(query);
    return this.http.get<Media>(`${this.urlEndPoint}/${text}`).pipe(
      catchError(e => {
        if (e.status === 400) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }


}
