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
export class ProfileService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  editProfile(dataProfile): Observable<any> {
    dataProfile.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'user/edit_profile', JSON.stringify(dataProfile), httpOptions);
  }

  editPassword(password): Observable<any> {
    return this.http.post(environment.apiUrl + 'user/pass_profile', JSON.stringify({
      token: this.authService.getToken(),
      password: password
    }), httpOptions);
  }
}
