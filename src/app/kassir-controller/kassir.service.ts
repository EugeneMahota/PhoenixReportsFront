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
export class KassirService {

  itemGroupRepl:any;
  constructor(private authService: AuthService, private http: HttpClient) {
  }

  getGroup(): Observable<any> {
    return this.http.post(environment.apiUrl + 'group/group', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getListKassir(): Observable<any> {
    return this.http.post(environment.apiUrl + 'kassir/list', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getKassir(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'kassir/info', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  deleteKassir(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'kassir/del', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  editKassir(Kassir): Observable<any> {
    Kassir.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'kassir/edit', JSON.stringify(Kassir), httpOptions);
  }
  editPassword(newPassword): Observable<any> {
    newPassword.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'kassir/pass', JSON.stringify(newPassword), httpOptions);
  }

  addKassir(Kassir): Observable<any> {
    Kassir.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'kassir/add', JSON.stringify(Kassir), httpOptions);
  }

  saveGroupRepl(Group) {
    this.itemGroupRepl = Group;
  }

  getGroupRepl() {
    return this.itemGroupRepl;
  }

}
