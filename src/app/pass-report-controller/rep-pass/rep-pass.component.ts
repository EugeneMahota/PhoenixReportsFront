import {Component, OnDestroy, OnInit} from '@angular/core';
import {PassService} from '../pass.service';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute, Router} from '@angular/router';
import {ExcelPassService} from '../excel-pass.service';
import {DashService} from '../../dashboard/dash.service';
import {DateTimeAdapter} from 'ng-pick-datetime';

@Component({
  selector: 'app-rep-pass',
  templateUrl: './rep-pass.component.html',
  styleUrls: ['./rep-pass.component.css'],
  providers: [ExcelPassService]
})
export class RepPassComponent implements OnInit, OnDestroy {

  date = new Date();
  dateRange: any[] = [];
  activeDate: string;

  listCard: any[] = [];
  listCardActive: any[] = [];

  listGroup: any[] = [];
  listGroupActive: any[] = [];

  settingsCard = {
    text: 'Карты не выбраны',
    selectAllText: 'Выбрать все карты',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    searchPlaceholderText: ' Поиск',
    noDataLabel: 'Список пуст',
    groupBy: 'park',
    selectGroup: true,
    badgeShowLimit: 2
  };
  settingsGroup = {
    text: 'Группы не выбраны',
    selectAllText: 'Выбрать все группы',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    searchPlaceholderText: ' Поиск',
    noDataLabel: 'Список пуст',
    groupBy: 'group_repl',
    selectGroup: true,
    badgeShowLimit: 2
  };

  itemPark: any = {id: 0, name: ''};
  listPark: any[] = [];
  listReport: any[] = [];
  listTotal: any[] = [];

  showSettings: boolean;

  order: string = 'rep_name';
  reverse: boolean = false;

  private notifier: NotifierService;

  constructor(private passService: PassService,
              notifierService: NotifierService,
              private router: Router,
              private route: ActivatedRoute,
              private excelService: ExcelPassService,
              dateTimeAdapter: DateTimeAdapter<any>,
              private dashService: DashService) {
    dateTimeAdapter.setLocale('Ru');
    this.dashService.onShowSettings.subscribe(show => {
      this.showSettings = show;
    });
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.passService.getListCard().subscribe(response => {
      this.listCard = response;
      if (this.passService.getParam()) {
        this.listCardActive = this.passService.getParam().cards;
      } else {
        this.passService.getListCard().subscribe(response => {
          this.listCardActive = response;
        });
      }
    });

    this.passService.getListGroup().subscribe(response => {
      this.listGroup = response;
      if (this.passService.getParam()) {
        this.listGroupActive = this.passService.getParam().groups;
      } else {
        this.passService.getListGroup().subscribe(response => {
          this.listGroupActive = response;
        });
      }
    });

    if (this.passService.getParam()) {
      this.dateRange = [new Date(this.passService.getParam().date_start), new Date(this.passService.getParam().date_end)];

      this.listReport = this.passService.listReport;
      this.listTotal = this.passService.listTotal;
    } else {
      this.getDay();
    }
    this.dashService.doShowButton();
    this.dashService.doShowTitle('Отчет по аттракционам');

    if (this.dashService.getSettings()) {
      this.showSettings = this.dashService.getSettings();
    }
  }

  ngOnDestroy() {
    this.dashService.doShowButton();
    this.dashService.delTitle();
  }

  getReport(paramReport) {
    paramReport.date_start = +this.dateRange[0];
    paramReport.date_end = +this.dateRange[1];

    this.passService.getReport(paramReport).subscribe(response => {
      if (response.status === 'Ok') {
        let countEmpty: number = 0;
        for (let i = 0; response.data.length > i; i++) {
          if (response.data[i].data.length === 0) {
            countEmpty++;
          }
        }
        if (countEmpty === response.data.length) {
          this.notifier.notify('error', 'Отчет пуст! Попробуйте указать другой диапазон.');
          this.listTotal = [];
          this.listPark = [];
          this.listReport = [];
          this.passService.deleteParam();
        } else {
          this.itemPark = '';
          this.listTotal = [];
          this.listPark = [];
          this.listReport = [];
          for (let i = 0; response.data.length > i; i++) {
            this.listReport.push({
              id: response.data[i].id,
              name: response.data[i].name,
              data: [],
            });
            this.listTotal.push({
              id: response.data[i].id,
              quant: response.data[i].data.reduce((sum, value) => (+sum) + (+value.quant), 0),
              price: response.data[i].data.reduce((sum, value) => (+sum) + (+value.price), 0),
              bonus: response.data[i].data.reduce((sum, value) => (+sum) + (+value.bonus), 0),
            });
            for (let j = 0; response.data[i].data.length > j; j++) {
              this.listReport[i].data.push({
                attr_id: +response.data[i].data[j].attr_id,
                rep_name: response.data[i].data[j].rep_name,
                quant: +response.data[i].data[j].quant,
                price: +response.data[i].data[j].price,
                bonus: +response.data[i].data[j].bonus
              });
            }
          }
          this.listPark = this.listReport;
          this.passService.saveParam(paramReport);
        }
        this.passService.saveReport(this.listReport, this.listTotal);
      }
    });
  }

  Detalization(Park, Attr) {
    this.passService.saveDataDetail(Park.name, Attr.rep_name);
    this.router.navigate([Attr.attr_id], {relativeTo: this.route});
  }

  selectPark(Park) {
    this.listReport = [];
    this.itemPark = Park;
    this.listReport.push(Park);
  }

  selectParkAll() {
    this.listReport = this.listPark;
    this.itemPark = {};
  }

  exportExcel() {
    let listReportExcel: any[] = [];

    for (let i = 0; this.listReport.length > i; i++) {
      listReportExcel.push({
        'Парк': this.listReport[i].name,
        'Аттракцион': '',
        'Количество проходов': '',
        'Деньги': '',
        'Бонусы': ''
      });
      for (let j = 0; this.listReport[i].data.length > j; j++) {
        listReportExcel.push({
          'Парк': '',
          'Аттракцион': this.listReport[i].data[j].rep_name,
          'Количество проходов': +this.listReport[i].data[j].quant,
          'Деньги': +this.listReport[i].data[j].price,
          'Бонусы': +this.listReport[i].data[j].bonus
        });
      }
    }

    this.excelService.exportExcel(listReportExcel, 'Отчет');
  }


  setOrder(value) {
    if (value === this.order) {
      this.reverse = !this.reverse;
    }

    this.order = value;
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
    const month = 32 * 24 * 60 * 60 * 1000;
    //start
    let date: Date = new Date();
    let dateStart: Date = new Date(date.setDate(1));
    dateStart = new Date(new Date(dateStart.setHours(0)).setMinutes(0));
    //end
    let dateEnd: Date;
    dateEnd = new Date(new Date(this.date.setDate(1)).setMonth(date.getMonth() + 1));
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
