import {Component, OnInit} from '@angular/core';
import {CardReportService} from '../card-report.service';
import {ExcelCardService} from '../excel-card.service';

@Component({
  selector: 'app-rep-card',
  templateUrl: './rep-card.component.html',
  styleUrls: ['./rep-card.component.css'],
  providers: [ExcelCardService]
})
export class RepCardComponent implements OnInit {

  code: string;
  saveCode: string;

  listReport: any[] = [];

  money_b: any;
  money_n: any;
  msg: string;
  name_type_card: string;
  fl_block: any;
  fl_change: boolean = false;

  itemReport: any = {report_full_id: 0, name: ''};

  showUser: boolean = false;

  constructor(private cardService: CardReportService, private excelService: ExcelCardService) {
  }

  ngOnInit() {
    if(this.cardService.getCode()) {
      this.getReport(this.cardService.getCode());
      this.code = this.cardService.getCode();
    }
  }

  getReport(code) {
    this.cardService.getReport(code).subscribe(response => {
      if (response.status === 'Ok') {
        if(response.data.fl_change === false) {
          this.money_b = response.data.info.money_b;
          this.money_n = response.data.info.money_n;
          this.msg = response.data.info.msg;
          this.name_type_card = response.data.info.name_type_card;
          this.fl_block = +response.data.info.status_card;

          this.listReport = response.data.rep;

          this.saveCode = code;
        } else if(response.data.fl_change === true) {
          this.clearData();
          this.fl_change = response.data.fl_change;
          this.msg = response.data.msg;
        }
      }
    });
  }

  selectPass(Rep) {
    this.itemReport = Rep;
  }

  cancelPass() {
    this.cardService.Cancel({report_id: this.itemReport.report_full_id, code: this.saveCode}).subscribe(response => {
      if (response.status === 'Ok') {
        this.getReport(this.saveCode);
      }
    });
  }

  exportExcel() {
    let listReportExcel: any[] = [];

    for (let i = 0; this.listReport.length > i; i++) {
      listReportExcel.push(
        {
          'Операция': this.listReport[i].name,
          'Парк': this.listReport[i].name_park,
          'Место': this.listReport[i].place,
          'Кассир': this.listReport[i].user_name,
          'Дата': this.listReport[i].date,
          'Значение': this.listReport[i].value,
        }
      );
    }

    this.excelService.exportExcel(listReportExcel, 'Отчет');
  }

  editCard(Card) {
    this.cardService.editCard(Card).subscribe(response => {
      if (response.status === 'Ok') {
      } else if(response.status === 'Error') {
        this.getReport(this.saveCode);
      }
    });
  }

  clearData() {
    this.money_b = '';
    this.money_n = '';
    this.msg = '';
    this.name_type_card = '';
    this.fl_block = '';

    this.listReport = [];
  }

}
