import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashService} from '../dashboard/dash.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit, OnDestroy {

  constructor(private dashService: DashService) {
  }

  ngOnInit() {
    this.dashService.doShowTitle('Поддержка');
  }

  ngOnDestroy() {
    this.dashService.delTitle();
  }

}
