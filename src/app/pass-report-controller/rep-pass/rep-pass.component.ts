import {Component, OnDestroy, OnInit} from '@angular/core';
import {PassService} from '../pass.service';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute, Router} from '@angular/router';
import {ExcelPassService} from '../excel-pass.service';
import {DashService} from '../../dashboard/dash.service';

@Component({
  selector: 'app-rep-pass',
  templateUrl: './rep-pass.component.html',
  styleUrls: ['./rep-pass.component.css'],
  providers: [ExcelPassService]
})
export class RepPassComponent implements OnInit, OnDestroy {

  date = new Date();
  date_start: any;
  date_end: any;

  type_rep: string;

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

  searchStr: string;

  private notifier: NotifierService;

  constructor(private passService: PassService, notifierService: NotifierService, private router: Router, private route: ActivatedRoute, private excelService: ExcelPassService, private dashService: DashService) {
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
      this.getReport(this.passService.getParam());
      this.date_start = this.passService.getParam().date_start;
      this.date_end = this.passService.getParam().date_end;
    } else {
      this.onRepPassParam('day');
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
    paramReport.date_start = paramReport.date_start.toString().replace(/T/, ' ');
    paramReport.date_end = paramReport.date_end.toString().replace(/T/, ' ');


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

  //Готовые временные промежутки
  onRepPassParam(type_rep) {
    this.type_rep = type_rep;
    localStorage.setItem('type_rep', type_rep);
    //Отчет за день
    if (type_rep === 'day') {

      this.date_start = this.date.getFullYear().toString() + '-' + ((this.date.getMonth() + 1).toString().length == 2 ? (this.date.getMonth() + 1).toString() : '0' + (this.date.getMonth() + 1).toString()) + '-' + (this.date.getDate().toString().length == 2 ? this.date.getDate().toString() : '0' + this.date.getDate().toString()) + ' ' + '00:00';
      this.date_end = this.date.getFullYear().toString() + '-' + ((this.date.getMonth() + 1).toString().length == 2 ? (this.date.getMonth() + 1).toString() : '0' + (this.date.getMonth() + 1).toString()) + '-' + (this.date.getDate().toString().length == 2 ? this.date.getDate().toString() : '0' + this.date.getDate().toString()) + ' ' + '23:59';
    }
    //Отчет за неделю
    if (type_rep === 'week') {
      let day_milliseconds = 24 * 60 * 60 * 1000;
      let current_date = new Date();
      let monday = new Date(current_date.getTime() - (current_date.getDay() - 1) * day_milliseconds);
      let sunday = new Date(monday.getTime() + 6 * day_milliseconds);

      // this.date_start = monday;
      // this.date_end = sunday;
      this.date_start = monday.getFullYear().toString() + '-' + ((monday.getMonth() + 1).toString().length == 2 ? (monday.getMonth() + 1).toString() : '0' + (monday.getMonth() + 1).toString()) + '-' + (monday.getDate().toString().length == 2 ? monday.getDate().toString() : '0' + monday.getDate().toString()) + ' ' + '00:00';
      this.date_end = sunday.getFullYear().toString() + '-' + ((sunday.getMonth() + 1).toString().length == 2 ? (sunday.getMonth() + 1).toString() : '0' + (sunday.getMonth() + 1).toString()) + '-' + (sunday.getDate().toString().length == 2 ? sunday.getDate().toString() : '0' + sunday.getDate().toString()) + ' ' + '23:59';
    }
    //Отчет за месяц
    if (type_rep === 'month') {
      let month = 24 * 60 * 60 * 1000 * 30;
      let date = new Date;
      let date_end = new Date(Date.parse(date.toString()) + month);

      this.date_start = this.date.getFullYear().toString() + '-' + ((this.date.getMonth() + 1).toString().length == 2 ? (this.date.getMonth() + 1).toString() : '0' + (this.date.getMonth() + 1).toString()) + '-' + '01' + ' ' + '00:00';
      this.date_end = date_end.getFullYear().toString() + '-' + ((date_end.getMonth() + 1).toString().length == 2 ? (date_end.getMonth() + 1).toString() : '0' + (date_end.getMonth() + 1).toString()) + '-' + '01' + ' ' + '00:00';
    }
    //Отчет за год
    if (type_rep === 'year') {
      this.date_start = this.date.getFullYear().toString() + '-' + '01' + '-' + '01' + ' ' + '00:00';
      this.date_end = this.date.getFullYear().toString() + '-' + '12' + '-' + '31' + ' ' + '23:59';
    }
  }

  onDay(action) {
    if (this.type_rep === 'day') {
      if (action === 'plus') {
        let day = 24 * 60 * 60 * 1000;
        this.date_start = Date.parse(this.date_start) + day;
        this.date_end = Date.parse(this.date_end) + day;

        let date_start = new Date(this.date_start);
        let date_end = new Date(this.date_end);

        this.date_start = date_start.getFullYear().toString() + '-' + ((date_start.getMonth() + 1).toString().length == 2 ? (date_start.getMonth() + 1).toString() : '0' + (date_start.getMonth() + 1).toString()) + '-' + (date_start.getDate().toString().length == 2 ? date_start.getDate().toString() : '0' + date_start.getDate().toString()) + ' ' + '00:00';
        this.date_end = date_end.getFullYear().toString() + '-' + ((date_end.getMonth() + 1).toString().length == 2 ? (date_end.getMonth() + 1).toString() : '0' + (date_end.getMonth() + 1).toString()) + '-' + (date_end.getDate().toString().length == 2 ? date_end.getDate().toString() : '0' + date_end.getDate().toString()) + ' ' + '23:59';
      }
      if (action === 'minus') {
        let day = 24 * 60 * 60 * 1000;
        this.date_start = Date.parse(this.date_start) - day;
        this.date_end = Date.parse(this.date_end) - day;

        let date_start = new Date(this.date_start);
        let date_end = new Date(this.date_end);

        this.date_start = date_start.getFullYear().toString() + '-' + ((date_start.getMonth() + 1).toString().length == 2 ? (date_start.getMonth() + 1).toString() : '0' + (date_start.getMonth() + 1).toString()) + '-' + (date_start.getDate().toString().length == 2 ? date_start.getDate().toString() : '0' + date_start.getDate().toString()) + ' ' + '00:00';
        this.date_end = date_end.getFullYear().toString() + '-' + ((date_end.getMonth() + 1).toString().length == 2 ? (date_end.getMonth() + 1).toString() : '0' + (date_end.getMonth() + 1).toString()) + '-' + (date_end.getDate().toString().length == 2 ? date_end.getDate().toString() : '0' + date_end.getDate().toString()) + ' ' + '23:59';
      }
    }
  }

  onWeek(action) {
    if (this.type_rep === 'week') {
      if (action === 'plus') {
        let week = 24 * 60 * 60 * 1000 * 7;

        this.date_start = Date.parse(this.date_start) + week;
        this.date_end = Date.parse(this.date_end) + week;

        let monday = new Date(this.date_start);
        let sunday = new Date(this.date_end);

        this.date_start = monday.getFullYear().toString() + '-' + ((monday.getMonth() + 1).toString().length == 2 ? (monday.getMonth() + 1).toString() : '0' + (monday.getMonth() + 1).toString()) + '-' + (monday.getDate().toString().length == 2 ? monday.getDate().toString() : '0' + monday.getDate().toString()) + ' ' + '00:00';
        this.date_end = sunday.getFullYear().toString() + '-' + ((sunday.getMonth() + 1).toString().length == 2 ? (sunday.getMonth() + 1).toString() : '0' + (sunday.getMonth() + 1).toString()) + '-' + (sunday.getDate().toString().length == 2 ? sunday.getDate().toString() : '0' + sunday.getDate().toString()) + ' ' + '23:59';
      }
      if (action === 'minus') {
        let week = 24 * 60 * 60 * 1000 * 7;

        this.date_start = Date.parse(this.date_start) - week;
        this.date_end = Date.parse(this.date_end) - week;

        let monday = new Date(this.date_start);
        let sunday = new Date(this.date_end);

        this.date_start = monday.getFullYear().toString() + '-' + ((monday.getMonth() + 1).toString().length == 2 ? (monday.getMonth() + 1).toString() : '0' + (monday.getMonth() + 1).toString()) + '-' + (monday.getDate().toString().length == 2 ? monday.getDate().toString() : '0' + monday.getDate().toString()) + ' ' + '00:00';
        this.date_end = sunday.getFullYear().toString() + '-' + ((sunday.getMonth() + 1).toString().length == 2 ? (sunday.getMonth() + 1).toString() : '0' + (sunday.getMonth() + 1).toString()) + '-' + (sunday.getDate().toString().length == 2 ? sunday.getDate().toString() : '0' + sunday.getDate().toString()) + ' ' + '23:59';
      }
    }
  }

  onMonth(action) {
    if (this.type_rep === 'month') {
      if (action === 'plus') {
        let month = 24 * 60 * 60 * 1000 * 31;
        this.date_start = Date.parse(this.date_start) + month;
        this.date_end = Date.parse(this.date_end) + month;

        let date_start = new Date(this.date_start);
        let date_end = new Date(this.date_end);

        this.date_start = date_start.getFullYear().toString() + '-' + ((date_start.getMonth() + 1).toString().length === 2 ? (date_start.getMonth() + 1).toString() : '0' + (date_start.getMonth() + 1).toString()) + '-' + '01' + ' ' + '00:00';
        this.date_end = date_end.getFullYear().toString() + '-' + ((date_end.getMonth() + 1).toString().length === 2 ? (date_end.getMonth() + 1).toString() : '0' + (date_end.getMonth() + 1).toString()) + '-' + '01' + ' ' + '00:00';
      }
      if (action === 'minus') {
        let month = 24 * 60 * 60 * 1000 * 28;
        this.date_start = Date.parse(this.date_start) - month;
        this.date_end = Date.parse(this.date_end) - month;


        let date_start = new Date(this.date_start);
        let date_end = new Date(this.date_end);

        this.date_start = date_start.getFullYear().toString() + '-' + ((date_start.getMonth() + 1).toString().length === 2 ? (date_start.getMonth() + 1).toString() : '0' + (date_start.getMonth() + 1).toString()) + '-' + '01' + ' ' + '00:00';
        this.date_end = date_end.getFullYear().toString() + '-' + ((date_end.getMonth() + 1).toString().length === 2 ? (date_end.getMonth() + 1).toString() : '0' + (date_end.getMonth() + 1).toString()) + '-' + '01' + ' ' + '00:00';
      }
    }
  }

  onYear(action) {
    if (this.type_rep === 'year') {
      if (action === 'plus') {
        let year: number = 24 * 60 * 60 * 1000 * 366;
        this.date_start = Date.parse(this.date_start) + year;

        let date_start = new Date(this.date_start);

        this.date_start = date_start.getFullYear().toString() + '-' + '01' + '-' + '01' + ' ' + '00:00';
        this.date_end = date_start.getFullYear().toString() + '-' + '12' + '-' + '31' + ' ' + '23:59';
      }
      if (action === 'minus') {
        let year: number = 24 * 60 * 60 * 1000 * 365;
        this.date_start = Date.parse(this.date_start) - year;

        let date_start = new Date(this.date_start);

        this.date_start = date_start.getFullYear().toString() + '-' + '01' + '-' + '01' + ' ' + '00:00';
        this.date_end = date_start.getFullYear().toString() + '-' + '12' + '-' + '31' + ' ' + '23:59';
      }
    }
  }

  setOrder(value) {
    if (value === this.order) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

}
