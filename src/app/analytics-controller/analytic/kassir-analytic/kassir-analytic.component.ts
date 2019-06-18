import {Component, OnInit} from '@angular/core';
import {DateTimeAdapter} from 'ng-pick-datetime';
import {AnalyticService} from '../../analytic.service';
import {KassaService} from '../../../kassa-report-controller/kassa.service';
import {AuthService} from '../../../auth-controller/guard/auth.service';
import {Router} from '@angular/router';
import {CardReportService} from '../../../card-report-controller/card-report.service';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-kassir-analytic',
  templateUrl: './kassir-analytic.component.html',
  styleUrls: ['./kassir-analytic.component.css']
})
export class KassirAnalyticComponent implements OnInit {

  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartData = [
    {data: [], label: 'Количество открытых смен'},
    {data: [], label: 'Количество опозданий'}
  ];
  barChartOptions = {};

  public pieChartLabels = [];
  public pieChartData: number[] = [];
  public pieChartType: string = 'doughnut';
  public pieChartLegend = true;
  public pieChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    }
  };

  listCard: any[] = [];
  listCardActive: any[] = [];

  settingsCard = {
    text: 'Карты не выбраны',
    selectAllText: 'Выбрать все карты',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    searchPlaceholderText: ' Поиск',
    noDataLabel: 'Список пуст',
    groupBy: 'park',
    selectGroup: true,
    badgeShowLimit: 3
  };

  listPark: any[] = [];
  listParkActive: any[] = [];

  settingsPark = {
    text: 'Парки не выбраны',
    selectAllText: 'Выбрать все парки',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    searchPlaceholderText: ' Поиск',
    noDataLabel: 'Список пуст',
    badgeShowLimit: 3
  };

  date: Date = new Date();
  dateRange: any[] = [];
  activeDate: string = 'month';

  listReport: any[] = this.analyticService.listRepKassir;
  notifier: NotifierService;

  constructor(notifierService: NotifierService,
              dateTimeAdapter: DateTimeAdapter<any>,
              private analyticService: AnalyticService,
              private authService: AuthService) {
    dateTimeAdapter.setLocale('Ru');
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.getListCard();
    this.getListPark();
    this.getMonth();

    if (this.analyticService.dataKassir.cards.length > 0) {
      this.listCardActive = this.analyticService.dataKassir.cards;
      this.listParkActive = this.analyticService.dataKassir.parks;
      this.dateRange[0] = new Date(this.analyticService.dataKassir.date_start);
      this.dateRange[1] = new Date(this.analyticService.dataKassir.date_end);
    }
    this.getDataBar(this.analyticService.listRepKassir);
  }

  getListCard() {
    this.analyticService.getListCard().subscribe(res => {
      this.listCard = res;
      if (this.analyticService.dataKassir.cards.length === 0) {
        this.listCardActive = res;
      }
    });
  }

  getListPark() {
    this.authService.secondSetUserLoggedIn().subscribe(res => {
      let listPark: any[] = res.data.parks;
      for (let i = 0; listPark.length > i; i++) {
        this.listPark.push({id: listPark[i].park_id, itemName: listPark[i].name});
        if (this.analyticService.dataKassir.cards.length === 0) {
          this.listParkActive.push({id: listPark[i].park_id, itemName: listPark[i].name});
        }
      }
    });
  }

  getReport(repData) {
    this.analyticService.getAnalyticKassir(repData).subscribe(res => {
      this.listReport = res;
      this.getDataBar(res);
      if (res.length === 0) {
        this.notifier.notify('error', 'По данным параметрам ничего не найдено!');
      }
    });
  }

  getDataBar(listReport) {
    this.barChartLabels = [];
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];

    for (let i = 0; listReport.length > i; i++) {
      this.barChartLabels.push(listReport[i].name);
      this.barChartData[0].data.push(listReport[i].count_open_smens);
      this.barChartData[1].data.push(listReport[i].count_late);
    }
  }

  getDay() {
    let date: Date = new Date();
    let dateStart: Date = new Date(new Date(date.setHours(0)).setMinutes(0));
    let dateEnd: Date = new Date(new Date(date.setHours(23)).setMinutes(59));

    this.dateRange = [dateStart, dateEnd];
  }

  getWeek() {
    let day_milliseconds = 24 * 60 * 60 * 1000;
    let date: Date = new Date();
    let day: number = date.getDay();

    let dateStart = new Date(date.setDate(date.getDate() - day + (day === 0 ? -6 : 1)));
    let dateEnd = new Date(dateStart.getTime() + 6 * day_milliseconds);

    dateStart = new Date(new Date(dateStart.setHours(0)).setMinutes(0));
    dateEnd = new Date(new Date(dateEnd.setHours(23)).setMinutes(59));

    this.dateRange = [dateStart, dateEnd];
  }

  getMonth() {
    //start
    let date: Date = new Date();
    let dateStart: Date = new Date(date.setDate(1));
    dateStart = new Date(new Date(dateStart.setHours(0)).setMinutes(0));
    //end
    let dateEnd: Date;
    if (date.getMonth() === 11) {
      dateEnd = new Date(new Date(this.date.setDate(1)).setMonth(1));
      dateEnd = new Date(dateEnd.setFullYear(date.getFullYear() + 1));
    } else {
      dateEnd = new Date(new Date(this.date.setDate(1)).setMonth(date.getMonth() + 1));
    }
    dateEnd = new Date(new Date(dateEnd.setHours(0)).setMinutes(0));
    //add
    this.dateRange = [dateStart, dateEnd];
  }

  getYear() {
    //start
    let dateStart: Date = new Date(this.date.setDate(1));
    dateStart = new Date(dateStart.setMonth(0));
    dateStart = new Date(new Date(dateStart.setHours(0)).setMinutes(0));
    //end
    let dateEnd: Date = new Date(this.date.setDate(1));
    dateEnd = new Date(dateEnd.setMonth(0));
    dateEnd = new Date(new Date(dateEnd.setHours(0)).setMinutes(0));
    dateEnd = new Date(dateEnd.setFullYear(dateEnd.getFullYear() + 1));
    //add
    this.dateRange = [dateStart, dateEnd];
  }

  editDay(value) {
    let day: number = 24 * 60 * 60 * 1000;
    let dateStart: Date = this.dateRange[0];
    let dateEnd: Date = this.dateRange[1];

    if (value === '+') {
      dateStart = new Date(+dateStart + day);
      dateEnd = new Date(+dateEnd + day);
    }

    if (value === '-') {
      dateStart = new Date(+dateStart - day);
      dateEnd = new Date(+dateEnd - day);
    }
    //add
    this.dateRange = [dateStart, dateEnd];
  }

  editWeek(value) {
    let week: number = 24 * 60 * 60 * 1000 * 7;

    let dateStart: Date = this.dateRange[0];
    let dateEnd: Date = this.dateRange[1];

    if (value === '+') {
      dateStart = new Date(+dateStart + week);
      dateEnd = new Date(+dateEnd + week);
    }

    if (value === '-') {
      dateStart = new Date(+dateStart - week);
      dateEnd = new Date(+dateEnd - week);
    }
    //add
    this.dateRange = [dateStart, dateEnd];
  }

  editMonth(value) {
    let dateStart: Date = this.dateRange[0];
    let dateEnd: Date = this.dateRange[1];

    if (value === '+') {
      dateStart = new Date(dateStart.setMonth(dateStart.getMonth() + 1));
      dateEnd = new Date(dateEnd.setMonth(dateEnd.getMonth() + 1));
    }

    if (value === '-') {
      dateStart = new Date(dateStart.setMonth(dateStart.getMonth() - 1));
      dateEnd = new Date(dateEnd.setMonth(dateEnd.getMonth() - 1));
    }
    //add
    this.dateRange = [dateStart, dateEnd];
  }

  editYear(value) {
    let dateStart: Date = this.dateRange[0];
    let dateEnd: Date = this.dateRange[1];

    if (value === '+') {
      dateStart = new Date(dateStart.setFullYear(dateStart.getFullYear() + 1));
      dateEnd = new Date(dateEnd.setFullYear(dateEnd.getFullYear() + 1));
    }

    if (value === '-') {
      dateStart = new Date(dateStart.setFullYear(dateStart.getFullYear() - 1));
      dateEnd = new Date(dateEnd.setFullYear(dateEnd.getFullYear() - 1));
    }
    //add
    this.dateRange = [dateStart, dateEnd];
  }
}
