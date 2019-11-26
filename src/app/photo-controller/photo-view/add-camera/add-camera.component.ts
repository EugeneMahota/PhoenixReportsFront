import {Component, OnInit} from '@angular/core';
import {PhotoService} from '../../photo.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-camera',
  templateUrl: './add-camera.component.html',
  styleUrls: ['./add-camera.component.css']
})
export class AddCameraComponent implements OnInit {

  itemCamera: any = {};
  listPark: any[];

  constructor(private photoService: PhotoService, private router: Router) {
  }

  ngOnInit() {
    this.getListPark();
  }

  getListPark() {
    this.photoService.getlistPark().subscribe(res => {
      this.listPark = res;
    });
  }

  addCamera(Camera: any) {
    this.photoService.addCamera(Camera).subscribe(res => {
      if (res.status === 'Ok') {
        this.router.navigate(['dashboard', 'photo-view']);
      }
    });
  }

}
