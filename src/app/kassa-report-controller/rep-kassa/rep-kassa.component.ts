import {Component, OnDestroy, OnInit} from '@angular/core';
import {KassaService} from '../kassa.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ExcelKassaService} from '../excel-kassa.service';
import {NotifierService} from 'angular-notifier';
import {DashService} from '../../dashboard/dash.service';
import {DateTimeAdapter} from 'ng-pick-datetime';

@Component({
  selector: 'app-rep-kassa',
  templateUrl: './rep-kassa.component.html',
  styleUrls: ['./rep-kassa.component.css']
})
export class RepKassaComponent implements OnInit, OnDestroy {

  date = new Date();
  dateRange: any[] = [];
  activeDate: string = '';

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

  constructor(private kassaService: KassaService,
              private router: Router,
              private route: ActivatedRoute,
              private exportExcelService: ExcelKassaService,
              dateTimeAdapter: DateTimeAdapter<any>,
              notifierService: NotifierService,
              private dashService: DashService) {
    dateTimeAdapter.setLocale('Ru');
    this.kassaService.onHide.subscribe(show => {
      this.showSettings = show;
    });
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
      this.fl_cashless = this.kassaService.getParam().fl_cashless;
      this.fl_cash = this.kassaService.getParam().fl_cash;

      this.dateRange = [new Date(this.kassaService.getParam().date_start), new Date(this.kassaService.getParam().date_end)];
      this.listReport = this.kassaService.listReport;
      this.listTotal = this.kassaService.listReportTotal;
    } else {
      this.getDay();
    }
    this.kassaService.doButton();
    this.dashService.doShowTitle('Отчет по кассам');
    if (this.kassaService.getSettings()) {
      this.showSettings = this.kassaService.getSettings();
    }
  }

  ngOnDestroy() {
    this.kassaService.doButton();
    this.dashService.delTitle();
  }

  getReport(paramReport) {
    paramReport.date_start = +this.dateRange[0];
    paramReport.date_end = +this.dateRange[1];
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
        this.kassaService.saveReport(this.listReport, this.listTotal);
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

