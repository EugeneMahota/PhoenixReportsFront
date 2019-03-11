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

export class GraphicService {


  itemGroupRepl: any;
  constructor(private authService: AuthService, private http: HttpClient) {
  }

  getListGraphic(): Observable<any> {
    return this.http.post(environment.apiUrl + 'graphic/list', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getGraphic(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'graphic/info', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  deleteGraphic(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'graphic/del', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  editGraphic(Graphic): Observable<any> {
    Graphic.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'graphic/edit', JSON.stringify(Graphic), httpOptions);
  }

  addGraphic(Graphic): Observable<any> {
    Graphic.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'graphic/add', JSON.stringify(Graphic), httpOptions);
  }

  getListTypeGraphic(): Observable<any> {
    return this.http.post(environment.apiUrl + 'graphic/list_type_graphic', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  addPeriod(Period): Observable<any> {
    Period.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'graphic/add_period', JSON.stringify(Period), httpOptions);
  }

  editPeriod(Period): Observable<any> {
    Period.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'graphic/edit_period', JSON.stringify(Period), httpOptions);
  }

  deletePeriod(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'graphic/del_period', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  curGraphic(Data): Observable<any> {
    Data.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'graphic/cur_graphic', JSON.stringify(Data), httpOptions);
  }

  saveGroupRepl(Group) {
    this.itemGroupRepl = Group;
  }

  getGroupRepl() {
    return this.itemGroupRepl;
  }
}
