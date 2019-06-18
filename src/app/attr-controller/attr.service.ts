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
export class AttrService {

  itemAttr: string;
  itemPark: string;

  stateOrder = {reverse: null, order: null};

  constructor(private authService: AuthService, private http: HttpClient) {
  }

  getListAttr(): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr/list', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getListPark(): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr/list_park', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getAttr(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr/info', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  deleteAttr(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr/del', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  editAttr(Attr): Observable<any> {
    Attr.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'attr/edit', JSON.stringify(Attr), httpOptions);
  }

  addAttr(Attr): Observable<any> {
    Attr.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'attr/add', JSON.stringify(Attr), httpOptions);
  }

  getListSch(): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr/list_sch', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getListTypeSch(): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr/list_type_sch', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getListCard(): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr/price/list_card', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getPrice(Param): Observable<any> {
    Param.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'attr/info_by_param', JSON.stringify(Param), httpOptions);
  }

  saveAttr(Attr) {
    this.itemAttr = Attr;
  }

  getItemAttr() {
    return this.itemAttr;
  }

  savePark(Park) {
    this.itemPark = Park;
  }

  getPark() {
    return this.itemPark;
  }

  saveOrder(order, reverse) {
    this.stateOrder.order = order;
    this.stateOrder.reverse = reverse;
  }
}
