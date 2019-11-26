import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
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
export class PhotoReportService {

  listKassa: any[];
  listAttr: any[];

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getListPark(): Observable<any> {
    return this.http.post(environment.apiUrl + 'rep_photo/list_park', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getListAttr(parkId: number): Observable<any> {
    return this.http.post(environment.apiUrl + 'rep_photo/list_attr', JSON.stringify({
      token: this.authService.getToken(),
      park_id: parkId
    }), httpOptions)
      .pipe(map(res => {
        this.listAttr = [].slice.call(res);
        return this.listAttr.map(function (data: any) {
          return {
            id: data.attr_id,
            itemName: data.rep_name,
          };
        });
      }));
  }

  getListKassa(parkId: number): Observable<any> {
    return this.http.post(environment.apiUrl + 'rep_photo/list_kassa', JSON.stringify({
      token: this.authService.getToken(),
      park_id: parkId
    }), httpOptions)
      .pipe(map(res => {
        this.listKassa = [].slice.call(res);
        return this.listKassa.map(function (data: any) {
          return {
            id: data.kassa_id,
            itemName: data.name,
          };
        });
      }));
  }

  getListEventAttr(): Observable<any> {
    return this.http.post(environment.apiUrl + 'rep_photo/list_event_attr', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getListEventKassa(): Observable<any> {
    return this.http.post(environment.apiUrl + 'rep_photo/list_event_kassa', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getReport(repData): Observable<any> {
    repData.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'rep_photo/report', JSON.stringify(repData), httpOptions);

  }
}
