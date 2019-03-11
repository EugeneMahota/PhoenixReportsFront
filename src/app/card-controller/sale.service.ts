import { Injectable } from '@angular/core';
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
export class SaleService {

  token: string;
  constructor(private authService: AuthService, private http: HttpClient) {
    this.token = this.authService.getToken();
  }

  getListSale(id):Observable<any> {
    return this.http.post(environment.apiUrl + 'card/sale/list', JSON.stringify({token: this.token, id: id}), httpOptions);
  }

  getListPeriod():Observable<any> {
    return this.http.post(environment.apiUrl + 'card/sale/list_period', JSON.stringify({token: this.token}), httpOptions);
  }
  getListGraphic():Observable<any> {
    return this.http.post(environment.apiUrl + 'card/list_graphic', JSON.stringify({token: this.token}), httpOptions);
  }

  getSale(id):Observable<any> {
    return this.http.post(environment.apiUrl + 'card/sale/info', JSON.stringify({token: this.token, id: id}), httpOptions);
  }

  deleteSale(id):Observable<any> {
    return this.http.post(environment.apiUrl + 'card/sale/del', JSON.stringify({token: this.token, id: id}), httpOptions);
  }

  editSale(Sale):Observable<any> {
    Sale.token = this.token;
    return this.http.post(environment.apiUrl + 'card/sale/edit', JSON.stringify(Sale), httpOptions);
  }

  addSale(Sale):Observable<any> {
    Sale.token = this.token;
    return this.http.post(environment.apiUrl + 'card/sale/add', JSON.stringify(Sale), httpOptions);
  }

}
