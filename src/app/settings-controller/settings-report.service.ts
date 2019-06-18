import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.prod';
import {AuthService} from '../auth-controller/guard/auth.service';
import {map} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8'
  })
};

@Injectable({
  providedIn: 'root'
})
export class SettingsReportService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getListCard(): Observable<any> {
    return this.http.post(environment.apiUrl + 'repeditor/list_card', JSON.stringify({token: this.authService.getToken()}), httpOptions)
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

  getListRep(paramRep): Observable<any> {
    paramRep.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'repeditor/list_oper', JSON.stringify(paramRep), httpOptions);
  }

  getTotalRep(paramRep): Observable<any> {
    paramRep.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'repeditor/get_total', JSON.stringify(paramRep), httpOptions);
  }

  getListAllKassa(paramRep): Observable<any> {
    paramRep.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'repeditor/list_all_kassa', JSON.stringify(paramRep), httpOptions);
  }

  delRep(listOrder): Observable<any> {
    return this.http.post(environment.apiUrl + 'repeditor/edit', JSON.stringify({
      reports: listOrder,
      token: this.authService.getToken()
    }), httpOptions);
  }

//  attr settings

  getListAllAttr(paramRep): Observable<any> {
    paramRep.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'passeditor/list_all_attr', JSON.stringify(paramRep), httpOptions);
  }

  getListPass(param): Observable<any> {
    param.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'passeditor/list_oper', JSON.stringify(param), httpOptions);
  }

  getTotalPass(param): Observable<any> {
    param.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'passeditor/get_total', JSON.stringify(param), httpOptions);
  }

  delPass(param): Observable<any> {
    param.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'passeditor/edit', JSON.stringify(param), httpOptions);
  }


}
