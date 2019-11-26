import {Component, OnInit} from '@angular/core';
import {PhotoService} from '../photo.service';

@Component({
  selector: 'app-photo-view',
  templateUrl: './photo-view.component.html',
  styleUrls: ['./photo-view.component.css']
})
export class PhotoViewComponent implements OnInit {

  listCamera: any[];
  itemCamera: any;

  constructor(private photoService: PhotoService) {
  }

  ngOnInit() {
    this.getListCamera();
  }

  getListCamera() {
    this.photoService.getlistCamera().subscribe(res => {
      this.listCamera = res;
    });
  }


  delCamera() {
    this.photoService.delCamera(this.itemCamera.camera_id).subscribe(res => {
      if (res.status === 'Ok') {
        this.getListCamera();
      }
    });
  }

}
