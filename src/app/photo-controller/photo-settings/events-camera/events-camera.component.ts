import {Component, OnInit} from '@angular/core';
import {PhotoService} from '../../photo.service';
import {DateTimeAdapter} from 'ng-pick-datetime';

@Component({
  selector: 'app-events-camera',
  templateUrl: './events-camera.component.html',
  styleUrls: ['./events-camera.component.css']
})
export class EventsCameraComponent implements OnInit {
  listEvent: any[];
  listCamera: any[];

  listSettings: any[];

  itemSettingsAdd: any = {};
  itemSettingsEdit: any;
  itemSettingsDel: any;

  constructor(private photoService: PhotoService, dateTimeAdapter: DateTimeAdapter<any>) {
    dateTimeAdapter.setLocale('Ru');
  }

  ngOnInit() {
    this.getListEvent();
    this.getListCamera();
    this.getListSettings();
  }

  getListEvent() {
    this.photoService.getListTypeEvent().subscribe(res => {
      this.listEvent = res;
    });
  }


  getListCamera() {
    this.photoService.getlistCamera().subscribe(res => {
      this.listCamera = res;
    });
  }

  getListSettings() {
    this.photoService.getListSettingsEvent().subscribe(res => {
      this.listSettings = res;
    });
  }

  addSettingsEvent(Settings: any) {
    this.photoService.addSettingsEvent({
      camera_id: Settings.camera_id,
      type_event_id: Settings.type_event_id,
      interval_photo: Settings.interval_photo,
      count_photo: Settings.count_photo,
      date: +Settings.date
    }).subscribe(res => {
      if (res.status === 'Ok') {
        this.getListSettings();
      }
    });
  }

  editSettingsEvent(Settings: any) {
    this.photoService.editSettingsEvent({
      event_camera_id: Settings.event_camera_id,
      camera_id: Settings.camera_id,
      type_event_id: Settings.type_event_id,
      interval_photo: Settings.interval_photo,
      count_photo: Settings.count_photo,
      date: +Settings.date
    }).subscribe(res => {
      if (res.status === 'Ok') {
        this.getListSettings();
        this.itemSettingsEdit = null;
      }
    });
  }

  delCamera() {
    this.photoService.delSettingsEvent(this.itemSettingsDel.event_camera_id).subscribe(res => {
      if (res.status === 'Ok') {
        this.getListSettings();
        this.itemSettingsEdit = null;
      }
    });
  }

  setEventEdit(settings: any) {
    this.itemSettingsEdit = settings;
    this.itemSettingsEdit.date = new Date(settings.date);
  }
}
