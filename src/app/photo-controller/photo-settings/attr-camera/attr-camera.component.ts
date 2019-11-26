import { Component, OnInit } from '@angular/core';
import {PhotoService} from '../../photo.service';

@Component({
  selector: 'app-attr-camera',
  templateUrl: './attr-camera.component.html',
  styleUrls: ['./attr-camera.component.css']
})
export class AttrCameraComponent implements OnInit {

  listAttr: any[];
  listCamera: any[];

  listSettings: any[];

  itemSettingsAdd: any = {};
  itemSettingsEdit: any;
  itemSettingsDel: any;

  constructor(private photoService: PhotoService) {
  }

  ngOnInit() {
    this.getListAttr();
    this.getListCamera();
    this.getListSettings();
  }

  getListAttr() {
    this.photoService.getListAttr().subscribe(res => {
      this.listAttr = res;
    });
  }


  getListCamera() {
    this.photoService.getlistCamera().subscribe(res => {
      this.listCamera = res;
    });
  }

  getListSettings() {
    this.photoService.getListSettingsAttr().subscribe(res => {
      this.listSettings = res;
    });
  }

  addSettingsAttr(Settings: any) {
    this.photoService.addSettingsAttr(Settings).subscribe(res => {
      if (res.status === 'Ok') {
        this.getListSettings();
      }
    });
  }

  editSettingsAttr(Settings: any) {
    this.photoService.editSettingsAttr(Settings).subscribe(res => {
      if (res.status === 'Ok') {
        this.getListSettings();
        this.itemSettingsEdit = null;
      }
    });
  }

  delCamera() {
    this.photoService.delSettingsAttr(this.itemSettingsDel.attr_camera_id).subscribe(res => {
      if (res.status === 'Ok') {
        this.getListSettings();
        this.itemSettingsEdit = null;
      }
    });
  }

}
