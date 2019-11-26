import {Component, OnInit} from '@angular/core';
import {PhotoService} from '../../photo.service';

@Component({
  selector: 'app-kassa-camera',
  templateUrl: './kassa-camera.component.html',
  styleUrls: ['./kassa-camera.component.css']
})
export class KassaCameraComponent implements OnInit {

  listKassa: any[];
  listCamera: any[];

  listSettings: any[];

  itemSettingsAdd: any = {};
  itemSettingsEdit: any;
  itemSettingsDel: any;

  constructor(private photoService: PhotoService) {
  }

  ngOnInit() {
    this.getListKassa();
    this.getListCamera();
    this.getListSettings();
  }

  getListKassa() {
    this.photoService.getlistKassa().subscribe(res => {
      this.listKassa = res;
    });
  }


  getListCamera() {
    this.photoService.getlistCamera().subscribe(res => {
      this.listCamera = res;
    });
  }

  getListSettings() {
    this.photoService.getListSettingsKassa().subscribe(res => {
      this.listSettings = res;
    });
  }

  addSettingsKassa(Settings: any) {
    this.photoService.addSettingsKassa(Settings).subscribe(res => {
      if (res.status === 'Ok') {
        this.getListSettings();
      }
    });
  }

  editSettingsKassa(Settings: any) {
    this.photoService.editSettingsKassa(Settings).subscribe(res => {
      if (res.status === 'Ok') {
        this.getListSettings();
        this.itemSettingsEdit = null;
      }
    });
  }

  delCamera() {
    this.photoService.delSettingsKassa(this.itemSettingsDel.kassa_camera_id).subscribe(res => {
      if (res.status === 'Ok') {
        this.getListSettings();
        this.itemSettingsEdit = null;
      }
    });
  }
}
