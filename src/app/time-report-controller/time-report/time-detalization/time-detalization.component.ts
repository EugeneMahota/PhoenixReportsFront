import {Component, OnDestroy, OnInit} from '@angular/core';
import {TimeReportService} from '../../time-report.service';
import {TimeDetail} from '../../models/TimeDetail';
import {ActivatedRoute, Router} from '@angular/router';
import {CardReportService} from '../../../card-report-controller/card-report.service';
import {DashService} from '../../../dashboard/dash.service';

@Component({
  selector: 'app-time-detalization',
  templateUrl: './time-detalization.component.html',
  styleUrls: ['./time-detalization.component.css']
})
export class TimeDetalizationComponent implements OnInit, OnDestroy {

  id: number;
  listReport: TimeDetail[] = [];

  detailData: any = {
    park: '',
    attr: ''
  };
  constructor(private timeReportService: TimeReportService,
              private route: ActivatedRoute,
              private cardService: CardReportService,
              private router: Router,
              private dashService: DashService) { }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');

    this.detailData = this.timeReportService.detailData;
    this.timeReportService.getTimeDetalization(this.id).subscribe(res => {
      this.listReport = res;
    });

    this.dashService.doShowTitle(this.detailData.park + ' / ' + this.detailData.attr);
  }

  ngOnDestroy() {
    this.dashService.delTitle();
  }

  reportCard(code) {
    this.cardService.saveCode(code);
    this.router.navigate(['dashboard', 'rep-card']);
  }

}
