import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../auth-controller/guard/auth.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  listCamera: any[];

  constructor(private authService: AuthService, private http: HttpClient) {
  }

  getlistPark(): Observable<any> {
    return this.http.post(environment.apiUrl + 'camera/list_park', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getlistCamera(): Observable<any> {
    return this.http.post(environment.apiUrl + 'camera/list', JSON.stringify({token: this.authService.getToken()}), httpOptions)
      .pipe(map((res: any) => {
        return this.listCamera = res;
      }));
  }

  editCamera(Camera: any): Observable<any> {
    Camera.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'camera/edit', JSON.stringify(Camera), httpOptions);
  }

  addCamera(Camera: any): Observable<any> {
    Camera.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'camera/add', JSON.stringify(Camera), httpOptions);
  }

  delCamera(id: number): Observable<any> {
    return this.http.post(environment.apiUrl + 'camera/del', JSON.stringify(
      {token: this.authService.getToken(), camera_id: id}), httpOptions);
  }

  getByIdCamera(id: number) {
    return this.listCamera.find(x => x.camera_id === id);
  }


  getlistKassa(): Observable<any> {
    return this.http.post(environment.apiUrl + 'setting_camera_kassa/list_kassa', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getListSettingsKassa(): Observable<any> {
    return this.http.post(environment.apiUrl + 'setting_camera_kassa/list', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  addSettingsKassa(Kassa): Observable<any> {
    Kassa.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'setting_camera_kassa/add', JSON.stringify(Kassa), httpOptions);
  }

  editSettingsKassa(Kassa): Observable<any> {
    Kassa.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'setting_camera_kassa/edit', JSON.stringify(Kassa), httpOptions);
  }

  delSettingsKassa(id: number): Observable<any> {
    return this.http.post(environment.apiUrl + 'setting_camera_kassa/del', JSON.stringify({
      token: this.authService.getToken(), kassa_camera_id: id
    }), httpOptions);
  }

  getListAttr(): Observable<any> {
    return this.http.post(environment.apiUrl + 'setting_camera_attr/list_attr', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getListSettingsAttr(): Observable<any> {
    return this.http.post(environment.apiUrl + 'setting_camera_attr/list', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  addSettingsAttr(Attr): Observable<any> {
    Attr.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'setting_camera_attr/add', JSON.stringify(Attr), httpOptions);
  }

  editSettingsAttr(Attr): Observable<any> {
    Attr.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'setting_camera_attr/edit', JSON.stringify(Attr), httpOptions);
  }

  delSettingsAttr(id: number): Observable<any> {
    return this.http.post(environment.apiUrl + 'setting_camera_attr/del', JSON.stringify({
      token: this.authService.getToken(), attr_camera_id: id
    }), httpOptions);
  }

  getListTypeEvent(): Observable<any> {
    return this.http.post(environment.apiUrl + 'setting_camera_event/list_type', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  getListSettingsEvent(): Observable<any> {
    return this.http.post(environment.apiUrl + 'setting_camera_event/list', JSON.stringify({token: this.authService.getToken()}), httpOptions);
  }

  addSettingsEvent(Event): Observable<any> {
    Event.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'setting_camera_event/add', JSON.stringify(Event), httpOptions);
  }

  editSettingsEvent(Event): Observable<any> {
    Event.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'setting_camera_event/edit', JSON.stringify(Event), httpOptions);
  }

  delSettingsEvent(id: number): Observable<any> {
    return this.http.post(environment.apiUrl + 'setting_camera_event/del', JSON.stringify({
      token: this.authService.getToken(), event_camera_id: id
    }), httpOptions);
  }
}
