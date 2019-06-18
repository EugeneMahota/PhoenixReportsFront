import {Component, OnInit} from '@angular/core';
import {DateTimeAdapter} from 'ng-pick-datetime';
import {AuthService} from '../../../auth-controller/guard/auth.service';
import {PopularAttr} from '../../models/PopularAttr';
import {AnalyticService} from '../../analytic.service';
import {Router} from '@angular/router';
import {CardReportService} from '../../../card-report-controller/card-report.service';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  public pieChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    }
  };
  public pieChartLabels = [];
  public pieChartData: number[] = [];
  public pieChartType: string = 'doughnut';
  public pieChartLegend = true;

  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartData = [
    {data: [], label: 'Считают популярным'},
    {data: [], label: 'Считают непопулярным'}
  ];
  barChartOptions = {};

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
  activeDate: string = '';

  listReport: any[] = this.analyticService.listRepPeople;

  fullCountPass: number = 0;
  fullCountAddKassa: number = 0;
  fullCountAddApp: number = 0;

  notifier: NotifierService;
  constructor(notifierService: NotifierService,
              dateTimeAdapter: DateTimeAdapter<any>,
              private analyticService: AnalyticService,
              private authService: AuthService,
              private router: Router,
              private cardReportService: CardReportService) {
    dateTimeAdapter.setLocale('Ru');
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.getListCard();
    this.getListPark();
    this.getDay();

    this.getListPopularAttr(this.analyticService.listRepPeople);
    this.getPieData(this.analyticService.listRepPeople);

    if (this.analyticService.dataPeople.cards.length > 0) {
      this.listCardActive = this.analyticService.dataPeople.cards;
      this.listParkActive = this.analyticService.dataPeople.parks;
      this.dateRange[0] = new Date(this.analyticService.dataPeople.date_start);
      this.dateRange[1] = new Date(this.analyticService.dataPeople.date_end);
    }
  }

  getListCard() {
    this.analyticService.getListCard().subscribe(res => {
      this.listCard = res;
      if (this.analyticService.dataPeople.cards.length === 0) {
        this.listCardActive = res;
      }
    });
  }

  getListPark() {
    this.authService.secondSetUserLoggedIn().subscribe(res => {
      let listPark: any[] = res.data.parks;
      for (let i = 0; listPark.length > i; i++) {
        this.listPark.push({id: listPark[i].park_id, itemName: listPark[i].name});
        if (this.analyticService.dataPeople.cards.length === 0) {
          this.listParkActive.push({id: listPark[i].park_id, itemName: listPark[i].name});
        }
      }
    });
  }

  getReport(repData) {
    this.analyticService.getAnalyticPeople(repData).subscribe(res => {
      this.listReport = res;
      this.getListPopularAttr(res);
      this.getPieData(res);
      if (res.length === 0) {
        this.notifier.notify('error', 'По данным параметрам ничего не найдено!');
      }
    });
  }


  getListPopularAttr(listReport: any[]) {
    let listAttr: PopularAttr[] = [];
    for (let i = 0; listReport.length > i; i++) {
      if (listReport[i].popular_attr) {

        let popularAttr: PopularAttr = listAttr.find(x => x.name === listReport[i].popular_attr);
        let notPopularAttr: PopularAttr = listAttr.find(x => x.name === listReport[i].not_popular_attr);

        if (popularAttr) {
          listAttr.find(x => x.name === listReport[i].popular_attr).countPopular
            = listAttr.find(x => x.name === listReport[i].popular_attr).countPopular + 1;
        } else {
          listAttr.push({name: listReport[i].popular_attr, countPopular: 1, countNotPopular: 0});
        }

        if (notPopularAttr && popularAttr !== notPopularAttr) {

          listAttr.find(x => x.name === listReport[i].not_popular_attr).countNotPopular
            = listAttr.find(x => x.name === listReport[i].not_popular_attr).countNotPopular + 1;

        } else if (popularAttr !== notPopularAttr) {
          listAttr.push({name: listReport[i].not_popular_attr, countPopular: 0, countNotPopular: 1});
        }
      }
    }

    this.barChartLabels = [];
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    for (let i = 0; listAttr.length > i; i++) {
      this.barChartLabels.push(listAttr[i].name.slice(0, 9) + '..');
      this.barChartData[0].data.push(listAttr[i].countPopular);
      this.barChartData[1].data.push(listAttr[i].countNotPopular);
    }
  }

  getPieData(listReport: any[]) {
    this.pieChartLabels = [];
    this.fullCountPass = listReport.reduce((sum, value) => (+sum) + (+value.count_pass), 0);
    this.fullCountAddKassa = listReport.reduce((sum, value) => (+sum) + (+value.count_add_kassa), 0);
    this.fullCountAddApp = listReport.reduce((sum, value) => (+sum) + (+value.count_add_attach), 0);

    this.pieChartData[0] = this.fullCountPass;
    this.pieChartData[1] = this.fullCountAddKassa;
    this.pieChartData[2] = this.fullCountAddApp;

    if (this.fullCountPass) {
      this.pieChartLabels.push('Кол-во проходов');
      this.pieChartLabels.push('Кол-во пополнений через кассу');
      this.pieChartLabels.push('Кол-во пополнений через приложение');
    }
  }

  onCard(codeCard) {
    this.cardReportService.saveCode(codeCard);
    this.router.navigate(['dashboard', 'rep-card']);
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
