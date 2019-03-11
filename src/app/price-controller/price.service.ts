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
export class PriceService {

  constructor(private authService: AuthService, private http: HttpClient) {
  }

  getListPrice(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr/price/list', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  getPrice(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr/price/info', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  deletePrice(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr/price/del', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  editPrice(Price): Observable<any> {
    Price.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'attr/price/edit', JSON.stringify(Price), httpOptions);
  }

  addPrice(Price): Observable<any> {
    Price.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'attr/price/add', JSON.stringify(Price), httpOptions);
  }

  getListCard(): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr/price/list_card', JSON.stringify({token: this.authService.getToken()}), httpOptions)
  }

  getListGraphic(): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr/price/list_graphic', JSON.stringify({token: this.authService.getToken()}), httpOptions)
  }
}
