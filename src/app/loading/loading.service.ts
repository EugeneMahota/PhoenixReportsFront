import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {LoadingState} from './loading-state';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new Subject<LoadingState>();
  loadingState = this.loadingSubject.asObservable();

  constructor() {
  }

  show() {
    this.loadingSubject.next(<LoadingState>{show: true});
  }

  hide() {
    this.loadingSubject.next(<LoadingState>{show: false});
  }
}
