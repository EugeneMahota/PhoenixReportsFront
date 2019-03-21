import {Component, OnDestroy, OnInit} from '@angular/core';
import {PassService} from '../pass.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CardReportService} from '../../card-report-controller/card-report.service';
import {DashService} from '../../dashboard/dash.service';

@Component({
  selector: 'app-pass-detalization',
  templateUrl: './pass-detalization.component.html',
  styleUrls: ['./pass-detalization.component.css']
})
export class PassDetalizationComponent implements OnInit, OnDestroy {

  id: number;

  listReport: any[] = [];

  nameAttr: string;
  namePark: string;
  constructor(private passService: PassService, private route: ActivatedRoute, private router: Router, private cardService: CardReportService, private dashService: DashService) {
  }

  ngOnInit() {
    this.nameAttr = this.passService.getAttr();
    this.namePark = this.passService.getPark();

    this.dashService.doShowTitle(  this.namePark + ' / ' + this.nameAttr);

    this.id = +this.route.snapshot.paramMap.get('id');

    this.passService.getDetalization(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        this.listReport = response.data;
      } else if (response.status === 'Error') {
        this.router.navigate(['dashboard', 'rep-pass']);
      }
    });
  }

  ngOnDestroy() {
    this.dashService.delTitle();
  }

  reportCard(Code) {
    this.cardService.saveCode(Code);
    this.router.navigate(['dashboard', 'rep-card']);
  }

}
