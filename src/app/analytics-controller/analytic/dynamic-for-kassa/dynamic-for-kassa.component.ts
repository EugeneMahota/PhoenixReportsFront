import {Component, OnInit} from '@angular/core';
import {KassaService} from '../../../kassa-report-controller/kassa.service';
import {AnalyticService} from '../../analytic.service';
import {DateTimeAdapter} from 'ng-pick-datetime';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-dynamic-form-kassa',
  templateUrl: './dynamic-for-kassa.component.html',
  styleUrls: ['./dynamic-for-kassa.component.css']
})
export class DynamicForKassaComponent implements OnInit {

  listDateDiapason: any[] = [];

  activeDate: string = 'month';
  dateRange: any[] = [];
  date: Date = new Date();

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

  listKassa: any[] = [];
  listKassaActive: any[] = [
    {id: 0, itemName: '', park: ''}
  ];

  settingsKassa = {
    text: 'Касса не выбрана',
    selectAllText: 'Выбрать все карты',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    searchPlaceholderText: ' Поиск',
    noDataLabel: 'Список пуст',
    groupBy: 'park',
    badgeShowLimit: 3,
    singleSelection: true
  };

  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartData = [
    {data: [], label: 'Общая выручка за период'},
  ];
  barChartOptions = {};

  listReport: any[] = [];
  totalRep: number;

  notifier: NotifierService;
  constructor(notifierService: NotifierService,
              dateTimeAdapter: DateTimeAdapter<any>,
              private analyticService: AnalyticService) {
    dateTimeAdapter.setLocale('Ru');
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.getDay();
    this.getListCard();
    this.getListKassa();
    this.setDateDiapason();

    this.listReport = this.analyticService.listDynamicKassa;
    this.getDataForBar(this.analyticService.listDynamicKassa);
    if (this.analyticService.dataDynamicKassa.date.length > 0) {
      this.listDateDiapason = this.analyticService.dataDynamicKassa.date;
    }
    this.totalRep = this.listReport.reduce((sum, value) => (+sum) + (+value.total), 0);
  }

  getListCard() {
    this.analyticService.getListCard().subscribe(res => {
      this.listCard = res;
      if (this.analyticService.dataDynamicKassa.cards.length > 0) {
        this.listCardActive = this.analyticService.dataDynamicKassa.cards;
      } else {
        this.listCardActive = res;
      }
    });
  }

  getListKassa() {
    this.analyticService.getListKassa().subscribe(res => {
      this.listKassa = res;
      if (this.analyticService.dataDynamicKassa.kassa !== 0) {
        let kassa = this.listKassa.find(x => x.id === this.analyticService.dataDynamicKassa.kassa);
        this.listKassaActive[0] = kassa;
      } else {
        this.listKassaActive[0] = res[0];
      }
    });
  }

  addDiapason() {
    let dateStartMedia = (
        this.dateRange[0].getDate().toString().length === 1 ? '0' + this.dateRange[0].getDate().toString() : this.dateRange[0].getDate()) + '.' +
      ((this.dateRange[0].getMonth() + 1).toString().length === 1 ? '0' + (this.dateRange[0].getMonth() + 1).toString() : (this.dateRange[0].getMonth() + 1)) + '.' +
      this.dateRange[0].getFullYear() + ' ' +
      (this.dateRange[0].getHours().toString().length === 1 ? '0' + this.dateRange[0].getHours().toString() : this.dateRange[0].getHours()) + ':' +
      (this.dateRange[0].getMinutes().toString().length === 1 ? '0' + this.dateRange[0].getMinutes().toString() : this.dateRange[0].getMinutes());

    let dateEndMedia = (this.dateRange[1].getDate().toString().length === 1 ? '0' + this.dateRange[1].getDate().toString() : this.dateRange[1].getDate()) + '.' +
      ((this.dateRange[1].getMonth() + 1).toString().length === 1 ? '0' + (this.dateRange[1].getMonth() + 1).toString() : (this.dateRange[1].getMonth() + 1)) + '.' +
      this.dateRange[1].getFullYear() + ' ' +
      (this.dateRange[1].getHours().toString().length === 1 ? '0' + this.dateRange[1].getHours().toString() : this.dateRange[1].getHours()) + ':' +
      (this.dateRange[1].getMinutes().toString().length === 1 ? '0' + this.dateRange[1].getMinutes().toString() : this.dateRange[1].getMinutes());

    this.listDateDiapason.push(
      {
        date_start: +this.dateRange[0] + 10800000,
        date_end: +this.dateRange[1] + 10800000,
        date_start_media: dateStartMedia,
        date_end_media: dateEndMedia
      });
  }

  delDiapason(date) {
    this.listDateDiapason.splice(this.listDateDiapason.indexOf(date), 1);
  }

  getReport(repData) {
    this.analyticService.getDynamicKassa(repData).subscribe(res => {
      this.listReport = res;
      this.getDataForBar(res);

      this.totalRep = this.listReport.reduce((sum, value) => (+sum) + (+value.total), 0);

      if (res.length === 0) {
        this.notifier.notify('error', 'По данным параметрам ничего не найдено!');
      }
    });
  }

  getDataForBar(listReport: any []) {
    this.barChartLabels = [];
    this.barChartData[0].data = [];
    for (let i = 0; listReport.length > i; i++) {
      this.barChartLabels.push(
        listReport[i].date_start_media.slice(0, 10) + ' - ' +
        listReport[i].date_end_media.slice(0, 10));
      this.barChartData[0].data.push(+listReport[i].total);
    }

    this.barChartLabels = this.barChartLabels.reverse();
    this.barChartData[0].data = this.barChartData[0].data.reverse();
    this.barChartData[1].data = this.barChartData[1].data.reverse();
  }

  activeDateDiapason(dateStart, dateEnd) {
    return this.listReport.find(x => x.date_start_media === dateStart) && this.listReport.find(x => x.date_end_media === dateEnd)
      ? 'active-date' : '';
  }

  setDateDiapason() {
    this.getMonth();
    this.addDiapason();
    this.editMonth('-');
    this.addDiapason();
    this.editMonth('-');
    this.addDiapason();
    this.editMonth('-');
    this.addDiapason();
    this.editMonth('-');
    this.addDiapason();
    this.editMonth('-');
    this.getMonth();
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

  setDiapasonDay() {
    this.listDateDiapason = [];
    this.getDay();
    this.addDiapason();
    this.editDay('-');
    this.addDiapason();
    this.editDay('-');
    this.addDiapason();
    this.editDay('-');
    this.addDiapason();
    this.editDay('-');
    this.addDiapason();
    this.editDay('-');
  }

  setDiapasonWeek() {
    this.listDateDiapason = [];
    this.getWeek();
    this.addDiapason();
    this.editWeek('-');
    this.addDiapason();
    this.editWeek('-');
    this.addDiapason();
    this.editWeek('-');
    this.addDiapason();
    this.editWeek('-');
    this.addDiapason();
    this.editWeek('-');
  }

  setDiapasonMonth() {
    this.listDateDiapason = [];
    this.getMonth();
    this.addDiapason();
    this.editMonth('-');
    this.addDiapason();
    this.editMonth('-');
    this.addDiapason();
    this.editMonth('-');
    this.addDiapason();
    this.editMonth('-');
    this.addDiapason();
    this.editMonth('-');
  }

  setDiapasonYear() {
    this.listDateDiapason = [];
    this.getYear();
    this.addDiapason();
    this.editYear('-');
    this.addDiapason();
    this.editYear('-');
    this.addDiapason();
    this.editYear('-');
  }
}
