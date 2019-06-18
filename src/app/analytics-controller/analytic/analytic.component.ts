import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashService} from '../../dashboard/dash.service';

@Component({
  selector: 'app-analytic',
  templateUrl: './analytic.component.html',
  styleUrls: ['./analytic.component.css']
})
export class AnalyticComponent implements OnInit, OnDestroy {

  constructor(private dashboardService: DashService) {
    this.dashboardService.doShowTitle('Графики и Аналитика');
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.dashboardService.delTitle();
  }
}
