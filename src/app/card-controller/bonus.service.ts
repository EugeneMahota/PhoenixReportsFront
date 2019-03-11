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
export class BonusService {

  token: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.token = this.authService.getToken();
  }

  getListBonus(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'card/bonus/list', JSON.stringify({token: this.token, id: id}), httpOptions);
  }

  getBonus(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'card/bonus/info', JSON.stringify({token: this.token, id: id}), httpOptions);
  }

  deleteBonus(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'card/bonus/del', JSON.stringify({token: this.token, id: id}), httpOptions);
  }

  editBonus(Bonus): Observable<any> {
    Bonus.token = this.token;
    return this.http.post(environment.apiUrl + 'card/bonus/edit', JSON.stringify(Bonus), httpOptions);
  }
  addBonus(Bonus): Observable<any> {
    Bonus.token = this.token;
    return this.http.post(environment.apiUrl + 'card/bonus/add', JSON.stringify(Bonus), httpOptions);
  }

}
