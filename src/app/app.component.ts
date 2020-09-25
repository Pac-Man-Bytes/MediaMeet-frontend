import {Component, OnDestroy, OnInit} from '@angular/core';
import {MediaObserver, MediaChange} from '@angular/flex-layout';
import {Subscription} from 'rxjs';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MediaMeet-frontend';
  mediaSub: Subscription;
  deviceXs: boolean;

  constructor(public mediaObserver: MediaObserver) {
  }

  ngOnInit(): void {
    this.mediaSub = this.mediaObserver.asObservable().pipe(
      filter((results: MediaChange[]) => results.length > 0),
      map((results: MediaChange[]) => results[0])
    ).subscribe(
      (result: MediaChange) => {
        console.log(result.mqAlias);
        this.deviceXs = result.mqAlias === 'xs' ? true : false;
      }
    );
  }

  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
  }
}
