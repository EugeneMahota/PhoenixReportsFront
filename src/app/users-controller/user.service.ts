import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../auth-controller/guard/auth.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getUsers(): Observable<any> {
    return this.http.post(environment.apiUrl + 'user/list', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }
  getParks(): Observable<any> {
    return this.http.post(environment.apiUrl + 'user/parks_list', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getUser(id):Observable<any> {
    return this.http.post(environment.apiUrl + 'user/info', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  addUser(addUser): Observable<any> {
    addUser.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'user/add', JSON.stringify(addUser), httpOptions);
  }

  editUser(editUser):Observable<any> {
    editUser.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'user/edit', JSON.stringify(editUser), httpOptions);
  }
  editPassword(id, password):Observable<any>{
    return this.http.post(environment.apiUrl + 'user/change_pass', JSON.stringify({token: this.authService.getToken(), id: id, password: password}), httpOptions);
  }

  deleteUser(id):Observable<any> {
    return this.http.post(environment.apiUrl + 'user/del', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  getOptions(): Observable<any> {
    return this.http.post(environment.apiUrl + 'user/options', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }
}
