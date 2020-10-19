import {Component, OnDestroy, OnInit} from '@angular/core';
import {MediaObserver, MediaChange} from '@angular/flex-layout';
import {Subscription} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MediaMeet-frontend';
  mediaSub: Subscription;
  deviceXs: boolean;

  constructor(private oAuth: AngularFireAuth, public mediaObserver: MediaObserver) {
  }

  ngOnInit(): void {
    this.mediaSub = this.mediaObserver.asObservable().pipe(
      filter((results: MediaChange[]) => results.length > 0),
      map((results: MediaChange[]) => results[0])
    ).subscribe(
      (result: MediaChange) => {
        console.log(result.mqAlias);
        this.deviceXs = result.mqAlias === 'xs';
      }
    );
  }

  ngOnDestroy(): void { //TODO Set timeout logout
    this.oAuth.signOut().then(() => console.log('ENDED :D'));
    this.mediaSub.unsubscribe();
  }
}
