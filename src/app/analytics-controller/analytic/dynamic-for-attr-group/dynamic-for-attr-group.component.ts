import {Component, OnInit} from '@angular/core';
import {AnalyticService} from '../../analytic.service';
import {PassService} from '../../../pass-report-controller/pass.service';
import {DateTimeAdapter} from 'ng-pick-datetime';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-dynamic-for-attr-group',
  templateUrl: './dynamic-for-attr-group.component.html',
  styleUrls: ['./dynamic-for-attr-group.component.css']
})
export class DynamicForAttrGroupComponent implements OnInit {

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

  listGroup: any[] = [];
  listGroupActive: any[] = [
    {id: 0, itemName: '', group_repl: ''}
  ];

  settingsGroup = {
    text: 'Группы не выбраны',
    selectAllText: 'Выбрать все группы',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    searchPlaceholderText: ' Поиск',
    noDataLabel: 'Список пуст',
    groupBy: 'group_repl',
    singleSelection: true,
    enableSearchFilter: true
  };

  public barChartLabels = [];
  public barChartType = 'line';
  public barChartData = [
    {label: 'Выручка группы деньги', data: []},
    {label: 'Выручка группы бонус', data: []}
  ];
  barChartOptions = {};

  listReport: any[] = [];
  notifier: NotifierService;

  constructor(notifierService: NotifierService,
              dateTimeAdapter: DateTimeAdapter<any>,
              private analyticService: AnalyticService,
              private passService: PassService) {
    dateTimeAdapter.setLocale('Ru');
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.getListGroup();
    this.getListCard();
    this.getDay();
    this.setDiapasonMonth();

    if (this.analyticService.dataDynamicGroupAttr.date.length !== 0) {
      this.listDateDiapason = this.analyticService.dataDynamicGroupAttr.date;
    }
    this.getDataBar(this.analyticService.listDynamicGroupAttr);
  }

  getListGroup() {
    this.passService.getListGroup().subscribe(res => {
      this.listGroup = res;
      if (this.analyticService.dataDynamicGroupAttr.group !== 0) {
        let group = this.listGroup.find(x => x.id === this.analyticService.dataDynamicGroupAttr.group);
        this.listGroupActive[0] = group;
      } else {
        this.listGroupActive[0] = res[0];
      }
    });
  }

  getListCard() {
    this.analyticService.getListCard().subscribe(res => {
      this.listCard = res;
      if (this.analyticService.dataDynamicGroupAttr.cards.length > 0) {
        this.listCardActive = this.analyticService.dataDynamicGroupAttr.cards;
      } else {
        this.listCardActive = res;
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

  activeDateDiapason(dateStart, dateEnd) {
    return this.listReport.find(x => x.date_start_media === dateStart) && this.listReport.find(x => x.date_end_media === dateEnd)
      ? 'active-date' : '';
  }

  getReport(repData) {
    this.analyticService.getDynamicGroupAttr(repData).subscribe(res => {
      this.getDataBar(res);
      if (res.length === 0) {
        this.notifier.notify('error', 'По данным параметрам ничего не найдено!');
      }
    });
  }

  getDataBar(listReport) {
    this.barChartData[0].data = [];
    this.barChartLabels = [];

    let listLabel: any[] = [];
    let listBar: any[] = [];

    for (let i = 0; listReport.length > i; i++) {
      let itemBar = listBar.find(x => x.date_start_media === listReport[i].date_start_media);
      if (itemBar) {
        itemBar.total_money = itemBar.total_money + (+listReport[i].total_money);
        itemBar.total_bonus = itemBar.total_bonus + (+listReport[i].total_bonus);
        itemBar.attrs.push({
          rep_name: listReport[i].rep_name,
          total_money: listReport[i].total_money,
          total_bonus: listReport[i].total_bonus
        });
      } else {
        listLabel.push(listReport[i].date_start_media.slice(0, 10) + ' - ' + listReport[i].date_end_media.slice(0, 10));
        listBar.push({
          date_start_media: listReport[i].date_start_media,
          date_end_media: listReport[i].date_end_media,
          attrs: [
            {
              rep_name: listReport[i].rep_name,
              total_money: listReport[i].total_money,
              total_bonus: listReport[i].total_bonus
            }
          ],
          total_bonus: +listReport[i].total_bonus,
          total_money: +listReport[i].total_money
        });
      }
    }

    for (let i = 0; listBar.length > i; i++) {
      this.barChartData[0].data.push(listBar[i].total_money);
      this.barChartData[1].data.push(listBar[i].total_bonus);
    }
    this.barChartLabels = listLabel;
    this.listReport = listBar;

    this.barChartLabels = this.barChartLabels.reverse();
    this.barChartData[0].data = this.barChartData[0].data.reverse();
    this.barChartData[1].data = this.barChartData[1].data.reverse();
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
