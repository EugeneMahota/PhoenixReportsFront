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
export class GroupAttrService {

  itemGroupRepl: any;
  groupName: string;
  constructor(private authService: AuthService, private http: HttpClient) {
  }

  getListGroup(): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr_group/list', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  deleteGroup(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr_group/del', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  getGroup(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr_group/info', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  editGroup(Group): Observable<any> {
    Group.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'attr_group/edit', JSON.stringify(Group), httpOptions);
  }

  addGroup(Group): Observable<any> {
    Group.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'attr_group/add', JSON.stringify(Group), httpOptions);
  }

  getListAttr(id): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr_group/attr_list', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  getListUser(): Observable<any> {
    return this.http.post(environment.apiUrl + 'attr_group/user_list', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  saveGroupName(nameGroup) {
    this.groupName = nameGroup;
  }

  getGroupName() {
    return this.groupName;
  }

  saveGroupRepl(Group) {
    this.itemGroupRepl = Group;
  }

  getGroupRepl() {
    return this.itemGroupRepl;
  }
}
