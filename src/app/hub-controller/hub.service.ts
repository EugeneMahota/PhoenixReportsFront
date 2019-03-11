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
export class HubService {

  itemPark: any;
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getListHub(): Observable<any> {
    return this.http.post(environment.apiUrl + 'hub/list', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getHub(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'hub/info', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  deleteHub(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'hub/del', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  editHub(Hub): Observable<any> {
    Hub.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'hub/edit', JSON.stringify(Hub), httpOptions);
  }

  addHub(Hub): Observable<any> {
    Hub.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'hub/add', JSON.stringify(Hub), httpOptions);
  }

  getGroup(): Observable<any> {
    return this.http.post(environment.apiUrl + 'group/park', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  savePark(Park) {
    this.itemPark = Park;
  }

  getPark() {
    return this.itemPark;
  }

}
