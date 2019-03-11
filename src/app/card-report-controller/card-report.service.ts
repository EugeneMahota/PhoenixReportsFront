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
export class CardReportService {


  codeCard: string;
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getReport(code):Observable<any> {
    return this.http.post(environment.apiUrl + 'rep_card/info', JSON.stringify({token: this.authService.getToken(), code: code}), httpOptions);
  }

  Cancel(Param):Observable<any> {
    Param.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'rep_card/cancel', JSON.stringify(Param), httpOptions);
  }

  editCard(Card):Observable<any> {
    Card.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'rep_card/edit', JSON.stringify(Card), httpOptions);
  }

  saveCode(Code) {
    this.codeCard = Code;
  }

  getCode() {
    return this.codeCard;
  }

  deleteCode() {
    this.codeCard = null;
  }


}
