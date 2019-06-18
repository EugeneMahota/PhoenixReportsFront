import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../auth-controller/guard/auth.service';
import {Observable} from 'rxjs';
import {Group} from './models/Group';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Park} from './models/Park';
import {TimeDetail} from './models/TimeDetail';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TimeReportService {

  listReportAbonement: Park[] = [];
  listReportTime: Park[] = [];

  listTimeDetail: TimeDetail[] = [];
  detailData: any = {
    park: '',
    attr: ''
  };

  dataReportAbonement: any = {
    date_start: 0,
    date_end: 0,
    groups: []
  };
  dataReportTime: any = {
    date_start: 0,
    date_end: 0,
    groups: []
  };

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getReportAbonement(dataReportAbonement: any): Observable<Park[]> {
    this.dataReportAbonement = dataReportAbonement;
    dataReportAbonement.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'rep_sub/list_attr', JSON.stringify(dataReportAbonement), httpOptions)
      .pipe(map(res => {
        this.listReportAbonement = [].slice.call(res);
        return this.listReportAbonement = this.listReportAbonement.map(function (data: any) {
          return {
            id: data.id,
            name: data.name,
            attrs: data.list.map(function (dataAttr: any) {
              return {
                id: dataAttr.attr_id,
                name: dataAttr.rep_name,
                quantity: dataAttr.quant
              };
            })
          };
        });
      }));
  }

  getReportTime(dataReportTime: any): Observable<Park[]> {
    this.dataReportTime = dataReportTime;
    dataReportTime.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'rep_time/list_attr', JSON.stringify(dataReportTime), httpOptions)
      .pipe(map(res => {
        this.listReportTime = [].slice.call(res);
        return this.listReportTime = this.listReportTime.map(function (data: any) {
          return {
            id: data.id,
            name: data.name,
            attrs: data.list.map(function (dataAttr: any) {
              return {
                id: dataAttr.attr_id,
                name: dataAttr.rep_name,
                quantity: dataAttr.quant
              };
            })
          };
        });
      }));
  }

  getTimeDetalization(id: number): Observable<TimeDetail[]> {
    this.dataReportTime.attr = id;
    this.dataReportTime.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'rep_time/detail', JSON.stringify(this.dataReportTime), httpOptions)
      .pipe(map(res => {
        this.listTimeDetail = [].slice.call(res);
        return this.listTimeDetail = this.listTimeDetail.map(function (data: any) {
          return {
            name: data.name,
            value: data.value,
            date: data.date,
            code: data.code,
          };
        });
      }));
  }

  getListGroupForAbonement(): Observable<Group[]> {
    return this.http.post(environment.apiUrl + 'rep_sub/list_group', JSON.stringify({token: this.authService.getToken()}), httpOptions)
      .pipe(map(res => {
        if (res['status'] === 'Ok') {
          let listGroup: Group[] = [];

          listGroup = [].slice.call(res['data']);
          return listGroup = listGroup.map(function (data: any) {
            return {
              id: data.group_id,
              itemName: data.name,
              group: data.group_repl
            };
          });
        } else {
          return [];
        }
      }));
  }

  getListGroupForTime(): Observable<Group[]> {
    return this.http.post(environment.apiUrl + 'rep_time/list_group', JSON.stringify({token: this.authService.getToken()}), httpOptions)
      .pipe(map(res => {
        if (res['status'] === 'Ok') {
          let listGroup: Group[] = [];

          listGroup = [].slice.call(res['data']);
          return listGroup = listGroup.map(function (data: any) {
            return {
              id: data.group_id,
              itemName: data.name,
              group: data.group_repl
            };
          });
        } else {
          return [];
        }
      }));
  }

  saveDetail(park: string, attr: string) {
    this.detailData.park = park;
    this.detailData.attr = attr;
  }
}
