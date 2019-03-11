import {Component, OnDestroy, OnInit} from '@angular/core';
import {KassaService} from '../kassa.service';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute, Router} from '@angular/router';
import {CardReportService} from '../../card-report-controller/card-report.service';
import {DashService} from '../../dashboard/dash.service';

@Component({
  selector: 'app-kassa-detalization',
  templateUrl: './kassa-detalization.component.html',
  styleUrls: ['./kassa-detalization.component.css']
})
export class KassaDetalizationComponent implements OnInit, OnDestroy {

  id: number;

  listReport: any[] = [];

  namePark: string;
  nameKassa: string;
  constructor(private kassaService: KassaService, private route: ActivatedRoute, private router: Router, private cardService: CardReportService, private dashService: DashService) {
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');

    this.kassaService.getDetalizationKassa(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        this.listReport = response.data;
      }
    });

    this.namePark = this.kassaService.getPark();
    this.nameKassa = this.kassaService.getKassa();
    this.dashService.doShowTitle(this.namePark + ' ' + '/' + ' ' + this.nameKassa);
  }

  ngOnDestroy() {
    this.dashService.delTitle();
  }

  reportCard(Code) {
    this.cardService.saveCode(Code);
    this.router.navigate(['dashboard', 'rep-card']);
  }

}
