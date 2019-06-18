import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SettingsReportService} from '../settings-report.service';
import {DateTimeAdapter} from 'ng-pick-datetime';
import {DashService} from '../../dashboard/dash.service';

@Component({
  selector: 'app-settings-report',
  templateUrl: './settings-report.component.html',
  styleUrls: ['./settings-report.component.css']
})
export class SettingsReportComponent implements OnInit, OnDestroy {

  listCard: any[] = [];
  listCardActive: any[] = [];

  listParkAndKass: any[] = [];
  itemKassa: any = {name: ''};

  settingsCard = {
    text: 'Выберите карты',
    selectAllText: 'Выбрать все карты',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    searchPlaceholderText: ' Поиск',
    noDataLabel: 'Список пуст',
    groupBy: 'park',
    selectGroup: true,
    badgeShowLimit: 2,
    disabled: false
  };

  date = new Date();
  dateRange: any[] = [];
  activeDate: string;

  repTotal: any = {
    sum_cash: null,
    sum_cashless: null,
    fisk_cash: null,
    no_fisk_cash: null,
    total: null
  };

  repOrder: any[] = [];
  totalValue: number;

  constructor(private settingService: SettingsReportService,
              dateTimeAdapter: DateTimeAdapter<any>,
              private dashService: DashService) {
    dateTimeAdapter.setLocale('Ru');
  }

  ngOnInit() {
    this.getListCard();
    this.getDay();
    this.dashService.doShowTitle('Настройка кассовых операций');
  }

  ngOnDestroy() {
    this.dashService.delTitle();
  }

  getListCard() {
    this.settingService.getListCard().subscribe(response => {
      this.listCard = response;
    });
  }

  getAllKassa(paramRep) {
    console.log(paramRep);
    this.clearPage();
    this.settingService.getListAllKassa(paramRep).subscribe(res => {
      this.listParkAndKass = res.data;
    });
  }

  getTotal(paramTotal) {
    this.settingService.getTotalRep(paramTotal).subscribe(res => {
      if (res.status === 'Ok') {
        this.repTotal = res.data[0];
      }
    });
  }

  getOrder(paramRep) {
    this.settingService.getListRep(paramRep).subscribe(res => {
      this.repOrder = res.data;
      for (let i = 0; this.repOrder.length > i; i++) {
        this.totalValue = this.repOrder.reduce((sum, value) => sum + value.value, 0);
      }
    });
  }

  delReport() {
    this.settingService.delRep(this.repOrder).subscribe(res => {
      if (res.status === 'Ok') {
        this.getTotal({
          card_id: this.listCardActive,
          kassa_id: this.itemKassa.kassa_id,
          date_start: +this.dateRange[0],
          date_end: +this.dateRange[1]
        });
        this.repOrder = [];
      }
    });
  }

  clearPage() {
    this.itemKassa = {};
    this.repTotal = {};
    this.repOrder = [];
  }

  fullClear() {
    this.listParkAndKass = [];
    this.itemKassa = {};
    this.repTotal = {};
    this.repOrder = [];
  }

//  date settings

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
