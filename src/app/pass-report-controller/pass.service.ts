import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../auth-controller/guard/auth.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.prod';
import {map} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PassService {


  reportParam: any;

  listReport: any[] = [];

  nameAttr: string;
  namePark: string;
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getReport(Param): Observable<any> {
    Param.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'rep_attr/report', JSON.stringify(Param), httpOptions);
  }

  getListGroup(): Observable<any> {
    return this.http.post(environment.apiUrl + 'rep_attr/list_group', JSON.stringify({token: this.authService.getToken()}), httpOptions)
      .pipe(map(response => {
        if(response['status'] === 'Ok') {
          let listGroup: any[] = [];
          for(let i = 0; response['data'].length > i; i++) {
            listGroup.push({id: response['data'][i].group_id, itemName: response['data'][i].name, group_repl: response['data'][i].group_repl});
          }
          return listGroup;
        }
      }));
  }

  getListCard(): Observable<any> {
    return this.http.post(environment.apiUrl + 'rep_attr/list_card', JSON.stringify({token: this.authService.getToken()}), httpOptions)
      .pipe(map(response => {
        let listCard:any[] = [];
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

  getDetalization(id): Observable<any> {
    this.reportParam.token = this.authService.getToken();
    this.reportParam.attr_id = id;
    return this.http.post(environment.apiUrl + 'rep_attr/detail', JSON.stringify(this.reportParam), httpOptions);
  }

  saveParam(Param) {
    this.reportParam = Param;
  }

  getParam() {
    return this.reportParam;
  }

  deleteParam() {
    this.reportParam = null;
  }

  saveDataDetail(park, name) {
    this.namePark = park;
    this.nameAttr = name;
  }

  getPark() {
    return this.namePark;
  }
  getAttr() {
    return this.nameAttr;
  }

}
