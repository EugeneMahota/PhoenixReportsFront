import {Component, OnInit} from '@angular/core';
import {GraphicService} from '../graphic.service';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-graphic',
  templateUrl: './edit-graphic.component.html',
  styleUrls: ['./edit-graphic.component.css']
})
export class EditGraphicComponent implements OnInit {

  private notifier: NotifierService;

  id: number;
  name: string;
  type_graphic_id: number;
  prior: number;
  listPeriod: any[] = [];
  itemPeriod: any;

  listTypeGraphic: any[] = [];

  date_start: string;
  date_end: string;

  period_act_id: number;
  date_s: string;
  date_e: string;

  itemGroupRepl: any;
  constructor(notifierService: NotifierService, private route: ActivatedRoute, private graphicService: GraphicService, private router: Router) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.itemGroupRepl = this.graphicService.getGroupRepl();

    this.id = +this.route.snapshot.paramMap.get('id');

    this.graphicService.getGraphic(this.id).subscribe(response => {
      this.name = response.data.name;
      this.type_graphic_id = response.data.type_graphic_id;
      this.prior = response.data.prior;
      this.listPeriod = response.data.period;
    });

    this.graphicService.getListTypeGraphic().subscribe(response => {
      if (response.status === 'Ok') {
        this.listTypeGraphic = response.data;
      }
    });
  }

  editGraphic(Graphic) {
    this.graphicService.editGraphic(Graphic).subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard', 'list-graphic']);
      }
    });
  }

  addPeriod(Period) {
    Period.date_start = Period.date_start.replace('T', ' ');
    Period.date_end = Period.date_end.replace('T', ' ');
    this.graphicService.addPeriod(Period).subscribe(response => {
      if (response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

  selectPeriod(Period) {
    this.itemPeriod = Period;
  }

  selectPeriodEdit(Period) {
    this.period_act_id = Period.period_act_id;
    this.date_start = Period.date_start;
    this.date_end = Period.date_end;
  }

  deletePeriod() {
    this.graphicService.deletePeriod(this.itemPeriod.period_act_id).subscribe(response => {
      if (response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

  editPeriod(Period) {
    if(Period.date_start.length > 18) {
      Period.date_start = Period.date_start.slice(0, -3);
    }
    if(Period.date_end.length > 18) {
      Period.date_end = Period.date_end.slice(0, -3);
    }

    Period.date_start = Period.date_start.replace('T', ' ');
    Period.date_end = Period.date_end.replace('T', ' ');
    this.graphicService.editPeriod(Period).subscribe(response => {
      if (response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

}
