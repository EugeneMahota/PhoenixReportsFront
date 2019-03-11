import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashService {


  private showButton: boolean = false;
  onShowButton: EventEmitter<boolean> = new EventEmitter();

  private showSettings: boolean = false;
  onShowSettings: EventEmitter<boolean> = new EventEmitter();
  statusSettings: boolean;

  title: string = 'Панель управления';
  onShowTittle: EventEmitter<string> = new EventEmitter();

  constructor() {
  }

  doShowButton() {
    this.showButton = !this.showButton;
    this.onShowButton.emit(this.showButton);
  }

  doShowSettings() {
    this.showSettings = !this.showSettings;
    this.onShowSettings.emit(this.showSettings);
    this.saveSettings(this.showSettings);
  }

  saveSettings(show) {
    this.statusSettings = show;
  }

  getSettings() {
    return this.statusSettings;
  }

  doShowTitle(title) {
    this.title = title;
    this.onShowTittle.emit(this.title);
  }

  delTitle() {
    this.title = 'Панель управления';
    this.onShowTittle.emit(this.title);
  }
}
