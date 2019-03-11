import {Component, OnDestroy, OnInit} from '@angular/core';
import {KassaService} from '../kassa.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ExcelKassaService} from '../excel-kassa.service';
import {NotifierService} from 'angular-notifier';
import {DashService} from '../../dashboard/dash.service';

@Component({
  selector: 'app-rep-kassa',
  templateUrl: './rep-kassa.component.html',
  styleUrls: ['./rep-kassa.component.css']
})
export class RepKassaComponent implements OnInit, OnDestroy {

  date = new Date();
  date_start: any;
  date_end: any;
  fl_cashless: boolean = true;
  fl_cash: boolean = true;
  type_rep: string;

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

  itemPark: any = {};
  listPark: any[] = [];
  listReport: any[] = [];
  listTotal: any[] = [];

  showSettings: boolean;

  reverse: boolean = false;
  order: string = 'name';

  private notifier: NotifierService;

  constructor(private kassaService: KassaService, private router: Router, private route: ActivatedRoute, private exportExcelService: ExcelKassaService, notifierService: NotifierService, private dashService: DashService) {
    this.kassaService.onHide.subscribe(show => {this.showSettings = show});
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.kassaService.getListCard().subscribe(response => {
      this.listCard = response;
      if (this.kassaService.getParam()) {
        this.listCardActive = this.kassaService.getParam().cards;
      } else {
        this.kassaService.getListCard().subscribe(response => {
          this.listCardActive = response;
        });
      }
    });

    if (this.kassaService.getParam()) {
      this.getReport(this.kassaService.getParam());
      this.date_start = this.kassaService.getParam().date_start;
      this.date_end = this.kassaService.getParam().date_end;
      this.fl_cashless = this.kassaService.getParam().fl_cashless;
      this.fl_cash = this.kassaService.getParam().fl_cash;
    } else {
      this.onRepPassParam('day');
    }
    this.kassaService.doButton();
    this.dashService.doShowTitle('Отчет по кассам');
    if(this.kassaService.getSettings()) {
      this.showSettings = this.kassaService.getSettings();
    }
  }

  ngOnDestroy() {
    this.kassaService.doButton();
    this.dashService.delTitle();
  }

  getReport(paramReport) {
    paramReport.date_start = paramReport.date_start.toString().replace(/T/, ' ');
    paramReport.date_end = paramReport.date_end.toString().replace(/T/, ' ');

    this.kassaService.getRepKassa(paramReport).subscribe(response => {
      if (response.status === 'Ok') {
        let countEmpty: number = 0;
        for (let i = 0; response.data.length > i; i++) {
          if (response.data[i].data.length === 0) {
            countEmpty++;
          }
        }
        if (countEmpty === response.data.length) {
          this.notifier.notify('error', 'Отчет пуст! Попробуйте указать другой диапазон.');
          this.listPark = [];
          this.listTotal = [];
          this.listReport = [];
          this.kassaService.deleteParam();
        } else {
          this.itemPark = '';
          this.listTotal = [];
          this.listPark = [];
          this.listReport = [];
          for (let i = 0; response.data.length > i; i++) {
            this.listPark.push({
              id: response.data[i].id,
              name: response.data[i].name,
              data: []
            });
            this.listTotal.push({
              id: response.data[i].id,
              count_card: response.data[i].data.reduce((sum, value) => (+sum) + (+value.count_card), 0),
              sum_add: response.data[i].data.reduce((sum, value) => (+sum) + (+value.sum_add), 0),
              sum_sale: response.data[i].data.reduce((sum, value) => (+sum) + (+value.sum_sale), 0),
              sum_ref: response.data[i].data.reduce((sum, value) => (+sum) + (+value.sum_ref), 0),
            });
            for (let j = 0; response.data[i].data.length > j; j++) {
              this.listPark[i].data.push({
                kassa_id: response.data[i].data[j].kassa_id,
                name: response.data[i].data[j].name,
                count_card: +response.data[i].data[j].count_card,
                sum_add: +response.data[i].data[j].sum_add,
                sum_ref: +response.data[i].data[j].sum_ref,
                sum_sale: +response.data[i].data[j].sum_sale,
                total: (+response.data[i].data[j].sum_add) + (+response.data[i].data[j].sum_sale) - (+response.data[i].data[j].sum_ref)
              });
            }
          }

          this.listReport = this.listPark;
          this.kassaService.saveParam(paramReport);
          this.itemPark = '';
        }
      }
    });

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

  Detalization(prk, kassa) {
    this.kassaService.saveDataDetail(prk, kassa);
    this.router.navigate([kassa.kassa_id], {relativeTo: this.route});
  }

  exportExcel() {
    let listReportExcel: any[] = [];
    for (let i = 0; this.listPark.length > i; i++) {
      listReportExcel.push(
        {
          'Парк': this.listPark[i].name,
          'Касса': '',
          'Продано карт': '',
          'Продажи': '',
          'Пополнение': '',
          'Возврат': '',
          'Итого': ''
        });
      for (let j = 0; this.listPark[i].data.length > j; j++) {
        listReportExcel.push(
          {
            'Парк': '',
            'Касса': this.listPark[i].data[j].name,
            'Продано карт': +this.listPark[i].data[j].count_card,
            'Продажи': +this.listPark[i].data[j].sum_sale,
            'Пополнение': +this.listPark[i].data[j].sum_add,
            'Возврат': +this.listPark[i].data[j].sum_ref,
            'Итого': (+this.listPark[i].data[j].sum_add) + (+this.listPark[i].data[j].sum_sale) - (+this.listPark[i].data[j].sum_ref)
          });
      }
    }
    this.exportExcelService.exportExcel(listReportExcel, 'Отчет');
  }


  //Готовые временные промежутки
  onRepPassParam(type_rep) {
    this.type_rep = type_rep;
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

      this.date_start = monday.getFullYear().toString() + '-' + ((monday.getMonth() + 1).toString().length == 2 ? (monday.getMonth() + 1).toString() : '0' + (monday.getMonth() + 1).toString()) + '-' + (monday.getDate().toString().length == 2 ? monday.getDate().toString() : '0' + monday.getDate().toString()) + ' ' + '00:00';
      this.date_end = sunday.getFullYear().toString() + '-' + ((sunday.getMonth() + 1).toString().length == 2 ? (sunday.getMonth() + 1).toString() : '0' + (sunday.getMonth() + 1).toString()) + '-' + (sunday.getDate().toString().length == 2 ? sunday.getDate().toString() : '0' + sunday.getDate().toString()) + ' ' + '23:59';
    }
    //Отчет за месяц
    if (type_rep === 'month') {
      let month = 24 * 60 * 60 * 1000 * 30;
      let date = new Date;
      let date_end = new Date(Date.parse(date.toString()) + month);

      this.date_start = this.date.getFullYear().toString() + '-' + ((this.date.getMonth() + 1).toString().length == 2 ? (this.date.getMonth() + 1).toString() : '0' + (this.date.getMonth() + 1).toString()) + '-' + '01' + ' ' + '00:00';
      this.date_end = date_end.getFullYear().toString() + '-' + ((date_end.getMonth() + 1).toString().length == 2 ? (date_end.getMonth()+1).toString() : '0' + (date_end.getMonth()+1).toString()) + '-' + '01' + ' ' + '00:00';
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
