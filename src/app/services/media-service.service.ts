import { Injectable } from '@angular/core';
import { Observable }  from 'rxjs';
import { map } from 'rxjs/operators'
import {HttpClient} from '@angular/common/http';
import { Media } from '../models/media';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class MediaService {
  urlEndPoint:string = "http://localhost:8080/api/media/youtube"
  constructor(private http: HttpClient, private router: Router) { }
  getClientes(): Observable<Media> {
    //Convertir el listado de clientes en un observable o Stream
    // return of(CLIENTES);
    //return this.http.get<Cliente[]>(this.urlEndPoint);
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Media)
    );
  }
}
