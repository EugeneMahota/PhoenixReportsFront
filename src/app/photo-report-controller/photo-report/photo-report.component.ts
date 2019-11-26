import {Component, OnDestroy, OnInit} from '@angular/core';
import {DateTimeAdapter} from 'ng-pick-datetime';
import {PhotoReportService} from '../photo-report.service';
import {DashService} from '../../dashboard/dash.service';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-photo-report',
  templateUrl: './photo-report.component.html',
  styleUrls: ['./photo-report.component.css']
})
export class PhotoReportComponent implements OnInit, OnDestroy {

  date = new Date();
  dateRange: any[] = [];
  activeDate: string = '';

  parkId: number;
  listPark: any[];

  listKassa: any[];
  listKassaActive: any[];
  listAttr: any[];
  listAttrActive: any[];

  listEvent: any[];
  listEventActive: any[];

  typeReport: string;

  settingsAttr = {
    text: 'Аттракционы не выбраны',
    selectAllText: 'Выбрать все аттракционы',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    searchPlaceholderText: ' Поиск',
    noDataLabel: 'Список пуст',
    badgeShowLimit: 3
  };
  settingsKassa = {
    text: 'Кассы не выбраны',
    selectAllText: 'Выбрать все кассы',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    searchPlaceholderText: ' Поиск',
    noDataLabel: 'Список пуст',
    badgeShowLimit: 3
  };
  settingsEvent = {
    text: 'События не выбраны',
    selectAllText: 'Выбрать все события',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    searchPlaceholderText: ' Поиск',
    noDataLabel: 'Список пуст',
    badgeShowLimit: 3,
    labelKey: 'name',
    primaryKey: 'event_id'
  };

  listReport: any[];
  listPhoto: any[];
  activePhoto: any[];

  private notifier: NotifierService;

  constructor(private dashboardService: DashService,
              notifierService: NotifierService,
              dateTimeAdapter: DateTimeAdapter<any>,
              private photoReportService: PhotoReportService) {
    dateTimeAdapter.setLocale('Ru');

    this.notifier = notifierService;
  }

  ngOnInit() {
    this.dashboardService.doShowTitle('Отчет по фотофиксации');

    this.typeReport = 'attr';
    this.getListPark();
    this.getDay();
  }

  ngOnDestroy() {
    this.dashboardService.delTitle();
  }

  getListPark() {
    this.photoReportService.getListPark().subscribe(res => {
      this.listPark = res;
      this.parkId = res[0].park_id;

      this.eventType();
    });
  }

  getListAttr() {
    this.photoReportService.getListAttr(this.parkId).subscribe(res => {
      this.listAttr = res;
    });
  }

  getListKassa() {
    this.photoReportService.getListKassa(this.parkId).subscribe(res => {
      this.listKassa = res;
    });
  }

  getListEventAttr() {
    this.photoReportService.getListEventAttr().subscribe(res => {
      this.listEvent = res;
    });
  }

  getListEventKassa() {
    this.photoReportService.getListEventKassa().subscribe(res => {
      this.listEvent = res;
    });
  }

  eventType() {
    if (this.typeReport === 'attr') {
      this.getListAttr();
      this.getListEventAttr();
    } else if (this.typeReport === 'kassa') {
      this.getListKassa();
      this.getListEventKassa();
    }
  }

  getReport(repData) {
    this.photoReportService.getReport(repData).subscribe(res => {
      this.listReport = res;
      if (this.listReport.length === 0) {
        this.notifier.notify('error', 'Отчет пуст!');
      }
    }, error => {
      this.notifier.notify('error', 'Ошибка получения!');
    });
  }

  setPhoto(listPhoto, activePhoto) {
    this.listPhoto = listPhoto;
    this.activePhoto = activePhoto;

    setTimeout(() => {
      document.getElementById(activePhoto).scrollIntoView({behavior: 'smooth', inline: 'center'});
    }, 1000);
  }

  setActivePhoto(photo) {
    this.activePhoto = photo;
    document.getElementById(photo).scrollIntoView({behavior: 'smooth', inline: 'center'});
  }

  carouselNext() {
    if (this.listPhoto.length !== (this.listPhoto.indexOf(this.activePhoto) + 1)) {
      this.activePhoto = this.listPhoto[this.listPhoto.indexOf(this.activePhoto) + 1];
    } else {
      this.activePhoto = this.listPhoto[0];
    }

    document.getElementById(this.activePhoto.toString()).scrollIntoView({behavior: 'smooth', inline: 'center'});
  }

  carouselPrev() {
    if (this.listPhoto.indexOf(this.activePhoto) !== 0) {
      this.activePhoto = this.listPhoto[this.listPhoto.indexOf(this.activePhoto) - 1];
    } else {
      this.activePhoto = this.listPhoto[this.listPhoto.length - 1];
    }

    document.getElementById(this.activePhoto.toString()).scrollIntoView({behavior: 'smooth', inline: 'center'});
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
