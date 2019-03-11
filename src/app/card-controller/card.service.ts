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
export class CardService {

  itemGroupRepl: any;
  constructor(private authService: AuthService, private http: HttpClient) {
  }


  getListCard():Observable<any> {
    return this.http.post(environment.apiUrl + 'card/list', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getCard(id):Observable<any> {
    return this.http.post(environment.apiUrl + 'card/info', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  deleteCard(id):Observable<any> {
    return this.http.post(environment.apiUrl + 'card/del', JSON.stringify({token: this.authService.getToken(), id: id}), httpOptions);
  }

  editCard(Card):Observable<any> {
    Card.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'card/edit', JSON.stringify(Card), httpOptions);
  }

  addCard(Card):Observable<any> {
    Card.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'card/add', JSON.stringify(Card), httpOptions);
  }

  saveGroupRepl(Group) {
    this.itemGroupRepl = Group;
  }

  getGroupRepl() {
    return this.itemGroupRepl;
  }

}
