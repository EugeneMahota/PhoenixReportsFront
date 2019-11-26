import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../auth-controller/guard/auth.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8'
  })
};

@Injectable({
  providedIn: 'root'
})

export class LogService {

  constructor(private authService: AuthService, private http: HttpClient) {
  }

  getListUser(): Observable<any> {
    return this.http.post(environment.apiUrl + 'logs/list_users', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getListLog(logData: any): Observable<any> {
    logData.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'logs', JSON.stringify(logData), httpOptions);
  }
}
