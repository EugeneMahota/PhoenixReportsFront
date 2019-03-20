import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth-controller/guard/auth.service';
import {KassaService} from '../kassa-report-controller/kassa.service';
import {PassService} from '../pass-report-controller/pass.service';
import {CardReportService} from '../card-report-controller/card-report.service';
import {DashService} from './dash.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  username: string;
  usernameDesktop: string;

  id: number;

  park;

  collapse: boolean = true;
  show: boolean = false;


  searchStr: string;

  showIconKassa: boolean = false;
  showButtonKassa: boolean = false;

  showIconPass: boolean = false;
  showButtonPass: boolean = false;
  title: string = 'Панель управления';
  constructor(
    private router: Router,
    private authService: AuthService,
    private kassaService: KassaService,
    private passService: PassService,
    private cardReportService: CardReportService,
    private dashService: DashService) {
    this.kassaService.onHide.subscribe(show => {this.showIconKassa = show});
    this.kassaService.onButton.subscribe(show => {this.showButtonKassa = show});
    this.dashService.onShowButton.subscribe(show => {this.showButtonPass = show});
    this.dashService.onShowSettings.subscribe(show => {this.showIconPass = show});
    this.dashService.onShowTittle.subscribe(title => {this.title = title});
  }

  DropCookies() {
    this.kassaService.deleteParam();
    this.passService.deleteParam();
    this.cardReportService.deleteCode();
    this.authService.onClear();
  }

  ngOnInit() {
    this.nowSide();
  }

  nowSide() {
    this.id = this.authService.getIdUser();
    this.username = this.authService.getLogin();
    this.usernameDesktop = this.authService.getLogin().slice(0, 5);


    if (screen.width < 1131) {
      this.show = true;
    }
    if (screen.width > 1131) {
      this.show = false;
    }
  }

  Side() {
    this.show = !this.show;
  }

  ShowDisplaySm() {
    if (screen.width < 1131) {
      this.show = !this.show;
    }
  }

  hideSettingsKassa() {
    this.kassaService.doHide();
  }

  hideSettingsPass() {
    this.dashService.doShowSettings();
  }

}
