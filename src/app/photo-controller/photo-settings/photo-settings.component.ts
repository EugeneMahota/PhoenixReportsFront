import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashService} from '../../dashboard/dash.service';

@Component({
  selector: 'app-photo-settings',
  templateUrl: './photo-settings.component.html',
  styleUrls: ['./photo-settings.component.css']
})
export class PhotoSettingsComponent implements OnInit, OnDestroy {

  constructor(private dashService: DashService) {
  }

  ngOnInit() {
    this.dashService.doShowTitle('Привязка камер');
  }

  ngOnDestroy() {
    this.dashService.delTitle();
  }

}
