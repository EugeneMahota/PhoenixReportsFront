import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashService} from '../../dashboard/dash.service';
import {DateTimeAdapter} from 'ng-pick-datetime';
import {Group} from '../models/Group';
import {Park} from '../models/Park';
import {TimeReportService} from '../time-report.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-menu-time-report',
  templateUrl: './time-report.component.html',
  styleUrls: ['./time-report.component.css']
})
export class TimeReportComponent implements OnInit, OnDestroy {

  listGroup: Group[] = [];
  listGroupActive: Group[] = [];

  settingsGroup: any = {
    text: 'Группы не выбраны',
    selectAllText: 'Выбрать все группы',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    searchPlaceholderText: ' Поиск',
    noDataLabel: 'Список пуст',
    badgeShowLimit: 3,
    groupBy: 'group',
    selectGroup: true
  };

  date: Date = new Date();
  dateRange: any[] = [];
  activeDate: string = '';

  listReport: Park[] = [];

  constructor(private dashboardService: DashService,
              private timeReportService: TimeReportService,
              dateTimeAdapter: DateTimeAdapter<any>,
              private router: Router,
              private route: ActivatedRoute) {
    dateTimeAdapter.setLocale('Ru');
  }

  ngOnInit() {
    this.dashboardService.doShowTitle('Отчет по временным аттракционам');
    this.getDay();
    this.getListGroup();

    this.listReport = this.timeReportService.listReportTime;
    if (this.timeReportService.dataReportTime.date_start !== 0) {
      this.dateRange[0] = new Date(this.timeReportService.dataReportTime.date_start);
      this.dateRange[1] = new Date(this.timeReportService.dataReportTime.date_end);
    }
  }

  ngOnDestroy() {
    this.dashboardService.delTitle();
  }

  getListGroup() {
    this.timeReportService.getListGroupForTime().subscribe(res => {
      this.listGroup = res;
      if (this.timeReportService.dataReportTime.groups.length !== 0) {
        this.listGroupActive = this.timeReportService.dataReportTime.groups;
      } else {
        this.listGroupActive = res;
      }
    });
  }

  getReport(dataAbonement) {
    this.timeReportService.getReportTime(dataAbonement).subscribe(res => {
      this.listReport = res;
    });
  }

  onDetalization(id: number, park: string, attr: string) {
    this.timeReportService.saveDetail(park, attr);
    this.router.navigate([id], {relativeTo: this.route});
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
