import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../auth-controller/guard/auth.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.prod';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8'
  })
};

@Injectable({
  providedIn: 'root'
})
export class SchService {

  token: string;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getListSch(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'hub/sch/list', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  getSch(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'hub/sch/info', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  deleteSch(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'hub/sch/del', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  editSch(Sch): Observable<any> {
    Sch.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'hub/sch/edit', JSON.stringify(Sch), httpOptions);
  }

  addSch(Sch): Observable<any> {
    Sch.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'hub/sch/add', JSON.stringify(Sch), httpOptions);
  }
}
