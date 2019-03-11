import {Injectable} from '@angular/core';
import {AuthService} from '../auth-controller/guard/auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
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
export class KassaService {

  itemPark: any;
  constructor(private authService: AuthService, private http: HttpClient) {
  }

  getGroupPark(): Observable<any> {
    return this.http.post(environment.apiUrl + 'group/park', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getListKassa(): Observable<any> {
    return this.http.post(environment.apiUrl + 'kassa/list', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getKassa(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'kassa/info', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  deleteKassa(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'kassa/del', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  editKassa(Kassa): Observable<any> {
    Kassa.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'kassa/edit', JSON.stringify(Kassa), httpOptions);
  }

  addKassa(Kassa): Observable<any> {
    Kassa.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'kassa/add', JSON.stringify(Kassa), httpOptions);
  }

  savePark(Park) {
    this.itemPark = Park;
  }

  getPark() {
    return this.itemPark;
  }

}
