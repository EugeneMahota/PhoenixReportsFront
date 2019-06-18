import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../auth-controller/guard/auth.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AnalyticService {

  dataPeople: any = {cards: [], parks: [], date_start: 0, date_end: 0};
  dataKassir: any = {cards: [], parks: [], date_start: 0, date_end: 0};
  dataDynamicKassa: any = {kassa: 0, cards: [], date: []};
  dataDynamicAttr: any = {cards: [], attr: 0, date: []};
  dataDynamicGroupAttr: any = {cards: [], group: 0, date: []};

  listRepPeople: any[] = [];
  listRepKassir: any[] = [];
  listDynamicKassa: any[] = [];
  listDynamicAttr: any[] = [];
  listDynamicGroupAttr: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getAnalyticPeople(repData): Observable<any> {
    this.dataPeople = repData;
    repData.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'analitic/people', JSON.stringify(repData), httpOptions)
      .pipe(map(res => {
        this.listRepPeople = this.listRepPeople.slice.call(res);
        return this.listRepPeople = this.listRepPeople.map(function (data: any) {
          return {
            code: data.code,
            count_add_kassa: data.count_add_kassa,
            count_add_attach: data.count_add_attach,
            count_pass: data.count_pass,
            sum_pass: data.sum_pass,
            // median: data.median,
            popular_attr: data.popular_attr,
            not_popular_attr: data.not_popular_attr
          };
        });
      }));
  }

  getAnalyticKassir(repData): Observable<any> {
    this.dataKassir = repData;
    repData.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'analitic/kassir', JSON.stringify(repData), httpOptions)
      .pipe(map(res => {
        this.listRepKassir = [].slice.call(res);
        return this.listRepKassir = this.listRepKassir.map(function (data: any) {
          return {
            kassir_id: data.kassir_id,
            name: data.name,
            count_open_smens: data.count_open_smens,
            count_close_smens: data.count_close_smens,
            count_late: data.count_late,
            count_sleep: data.count_sleep,
            total: data.total
          };
        });
      }));
  }

  getDynamicKassa(repData): Observable<any> {
    this.dataDynamicKassa = repData;
    repData.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'analitic/dinamic_kassa', JSON.stringify(repData), httpOptions)
      .pipe(map(res => {
        this.listDynamicKassa = [].slice.call(res);
        return this.listDynamicKassa = this.listDynamicKassa.map(function (data: any) {
          return {
            date_start_media: data.date_start_media,
            date_end_media: data.date_end_media,
            total: data.total
          };
        });
      }));
  }

  getDynamicAttr(repData): Observable<any> {
    this.dataDynamicAttr = repData;
    repData.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'analitic/dinamic_attr', JSON.stringify(repData), httpOptions)
      .pipe(map(res => {
        this.listDynamicAttr = [].slice.call(res);
        return this.listDynamicAttr = this.listDynamicAttr.map(function (data: any) {
          return {
            date_start_media: data.date_start_media,
            date_end_media: data.date_end_media,
            total_money: data.total_money,
            total_bonus: data.total_bonus
          };
        });
      }));
  }

  getDynamicGroupAttr(repData): Observable<any> {
    this.dataDynamicGroupAttr = repData;
    repData.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'analitic/dinamic_group_attr', JSON.stringify(repData), httpOptions)
      .pipe(map(res => {
        this.listDynamicGroupAttr = [].slice.call(res);
        return this.listDynamicGroupAttr = this.listDynamicGroupAttr.map(function (data: any) {
          return {
            date_start_media: data.date_start_media,
            date_end_media: data.date_end_media,
            total_money: data.total_money,
            total_bonus: data.total_bonus,
            rep_name: data.rep_name,
          };
        });
      }));
  }

  // -----------------------------

  getListKassa(): Observable<any> {
    return this.http.post(environment.apiUrl + 'analitic/list_kassa', JSON.stringify({token: this.authService.getToken()}), httpOptions)
      .pipe(map(res => {
        let listKassa: any[] = [];

        listKassa = listKassa.slice.call(res);
        return listKassa = listKassa.map(function (data: any) {
          return {
            id: data.kassa_id,
            itemName: data.name_kassa,
            park: data.name_park
          };
        });
      }));
  }

  getListAttr(): Observable<any> {
    return this.http.post(environment.apiUrl + 'analitic/list_attr', JSON.stringify({token: this.authService.getToken()}), httpOptions)
      .pipe(map(res => {
        let listAttr: any[] = [];

        listAttr = listAttr.slice.call(res);
        return listAttr = listAttr.map(function (data: any) {
          return {
            id: data.attr_id,
            itemName: data.rep_name,
            group: data.group_name
          };
        });
      }));
  }

  getListCard(): Observable<any> {
    return this.http.post(environment.apiUrl + 'analitic/list_card', JSON.stringify({token: this.authService.getToken()}), httpOptions)
      .pipe(map(response => {
        let listCard: any[] = [];
        for (let i = 0; response['data'].length > i; i++) {
          for (let j = 0; response['data'][i].list.length > j; j++) {
            listCard.push(
              {
                id: +response['data'][i].list[j].type_card_id,
                itemName: response['data'][i].list[j].name_type_card,
                park: response['data'][i].name
              });
          }
        }
        return listCard;
      }));
  }

  clearData() {
    this.dataPeople = {cards: [], parks: [], date_start: 0, date_end: 0};
    this.dataKassir = {cards: [], parks: [], date_start: 0, date_end: 0};
    this.dataDynamicKassa = {kassa: 0, cards: [], date: []};
    this.dataDynamicAttr = {cards: [], attr: 0, date: []};
    this.dataDynamicGroupAttr = {cards: [], group: 0, date: []};

    this.listRepPeople = [];
    this.listRepKassir = [];
    this.listDynamicKassa = [];
    this.listDynamicAttr = [];
    this.listDynamicGroupAttr = [];
  }
}
