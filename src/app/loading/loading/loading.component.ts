import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {LoadingService} from '../loading.service';
import {LoadingState} from '../loading-state';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, OnDestroy {

  show: boolean = false;

  private subscription: Subscription;

  constructor(private loadingService: LoadingService) { }

  ngOnInit() {
    this.subscription = this.loadingService.loadingState.subscribe((state: LoadingState) => {
      this.show = state.show;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
