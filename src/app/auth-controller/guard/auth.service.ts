import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8'
  })
};

@Injectable()
export class AuthService {

  private isUserLoggedIn: boolean;

  token: string;
  id: number;
  role: any[] = [];
  login: string;

  constructor(private router: Router, private cookieService: CookieService, private http: HttpClient) {
    this.token = this.cookieService.get('token');
  }

  secondSetUserLoggedIn(): Observable<any> {
    return this.http.post(environment.apiUrl + 'user/info_profile', {token: this.token}, httpOptions)
      .pipe(map(response => {
        if (this.token) {
          if (response['status'] === 'Ok') {
            this.isUserLoggedIn = true;

            this.login = response['data']['info']['name'];

            if (response['data']['roles']) {
              for (let i = 0; i < response['data']['roles'].length; i++) {
                this.role.push(response['data']['roles'][i].name_role);
              }
            }
          }
        } else {
          localStorage.clear();
        }
        return response;
      }));
  }


  setUserLoggedIn(Auth): Observable<any> {
    return this.http.post(environment.apiUrl + 'login', JSON.stringify(Auth), httpOptions).pipe(map((response => {
      if (response['status'] === 'Ok') {
        this.isUserLoggedIn = true;

        this.token = response['data']['token'];
        this.login = response['data']['info']['name'];

        if (response['data']['roles']) {
          for (let i = 0; i < response['data']['roles'].length; i++) {
            this.role.push(response['data']['roles'][i].name_role);
          }
        }

        if (Auth.savelogin === true) {
          this.cookieService.set('token', response['data']['token'], 604800, '/');
        }
      }

      return response;

    })));
  }


  getVersion(): Observable<any> {
    return this.http.get(environment.apiUrl + 'get_ver', httpOptions);
  }

  getUserLoggedIn() {
    return this.isUserLoggedIn; //возвращаем переменную, которая говорит есть ли у нас доступ, проверяем в auth.guard.ts и roles.guard.ts
  }

  getRole() {
    return this.role;
  }

  getLogin() {
    return this.login;
  }

  getIdUser() {
    return this.id;
  }

  getToken() {
    return this.token;
  }

  //Очищаем данные, выходя из системы
  onClear() {
    this.cookieService.deleteAll('/');
    this.token = '';
    this.login = '';
    this.role = [];
    this.isUserLoggedIn = false;
    localStorage.clear();
    this.router.navigate(['auth']);
  }


  refreshToken() {
    return this.http.post(environment.apiUrl + 'user/info_profile', {token: this.token}, httpOptions)
      .pipe(map(response => {
        if (this.token) {
          if (response['status'] === 'Ok') {
            this.isUserLoggedIn = true;

            this.login = response['data']['info']['name'];

            if (response['data']['roles']) {
              for (let i = 0; i < response['data']['roles'].length; i++) {
                this.role.push(response['data']['roles'][i].name_role);
              }
            }
            return true;
          } else {
            this.router.navigate(['/']);
            return false;
          }
        } else {
          localStorage.clear();
          this.router.navigate(['/']);
          return false;
        }
      }));
  }
}
