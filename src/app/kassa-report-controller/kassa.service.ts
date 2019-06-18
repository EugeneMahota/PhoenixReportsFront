import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../auth-controller/guard/auth.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.prod';
import {map} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8'
  })
};

@Injectable({
  providedIn: 'root'
})
export class KassaService {

  listGroup: any[] = [];
  listPark: any[] = [];
  listReport: any[] = [];
  listReportTotal: any[] = [];

  paramRep: any;

  private hideSettings: boolean = false;
  onHide:EventEmitter<boolean> = new EventEmitter<boolean>();
  stateSettings: boolean;

  private showButton: boolean = false;
  onButton: EventEmitter<boolean> = new EventEmitter<boolean>();

  namePark: string;
  nameKassa: string;
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getRepKassa(paramReport): Observable<any> {
    paramReport.token = this.authService.getToken();
    return this.http.post(environment.apiUrl + 'rep_kassa/report', JSON.stringify(paramReport), httpOptions);
  }

  getDetalizationKassa(id): Observable<any> {
    this.paramRep.token = this.authService.getToken();
    this.paramRep.kassa_id = id;
    return this.http.post(environment.apiUrl + 'rep_kassa/detail', JSON.stringify(this.paramRep), httpOptions);
  }

  getListCard(): Observable<any> {
    return this.http.post(environment.apiUrl + 'rep_kassa/list_card', JSON.stringify({token: this.authService.getToken()}), httpOptions)
      .pipe(map(response => {
        let listCard: any[] = [];
        for (let i = 0; response['data'].length > i; i++) {
          for (let j = 0; response['data'][i].list.length > j; j++) {
            listCard.push(
              {
                id: +response['data'][i].list[j].type_card_id,
                itemName: response['data'][i].list[j].name_type_card,
                park: response['data'][i].name
              });
          }
        }
        return listCard;
      }));
  }

  saveParam(Param) {
    this.paramRep = Param;
  }

  getParam() {
    return this.paramRep;
  }

  deleteParam() {
    this.paramRep = null;
  }

  public doHide() {
    this.hideSettings = !this.hideSettings;
    this.onHide.emit(this.hideSettings);
    this.saveSettings(this.hideSettings);
  }

  saveSettings(show) {
    this.stateSettings = show;
  }
  getSettings() {
    return this.stateSettings;
  }

  public doButton() {
    this.showButton = !this.showButton;
    this.onButton.emit(this.showButton);
  }

  saveDataDetail(prk, kassa) {
    this.namePark = prk.name;
    this.nameKassa = kassa.name;
  }

  getPark() {
    return this.namePark;
  }
  getKassa() {
    return this.nameKassa;
  }


  saveReport(listRep: any[], listTotal: any[]) {
    this.listReport = listRep;
    this.listReportTotal = listTotal;
  }
}
