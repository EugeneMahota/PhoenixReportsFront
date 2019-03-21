import {Component, OnInit} from '@angular/core';
import {GraphicService} from '../graphic.service';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute, Router} from '@angular/router';
import {DateTimeAdapter} from 'ng-pick-datetime';

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

  date_start: any;
  date_end: any;

  period_act_id: number;
  date_s: any;
  date_e: any;

  itemGroupRepl: any;
  constructor(notifierService: NotifierService, dateTimeAdapter: DateTimeAdapter<any>, private route: ActivatedRoute, private graphicService: GraphicService, private router: Router) {
    this.notifier = notifierService;
    dateTimeAdapter.setLocale('Ru');
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
    this.date_start = new Date(Period.date_start);
    this.date_end = new Date(Period.date_end);
  }

  deletePeriod() {
    this.graphicService.deletePeriod(this.itemPeriod.period_act_id).subscribe(response => {
      if (response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

  editPeriod(Period) {
    this.graphicService.editPeriod(Period).subscribe(response => {
      if (response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

}
