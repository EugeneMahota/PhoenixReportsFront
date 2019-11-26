import {Component, OnInit} from '@angular/core';
import {PhotoService} from '../../photo.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-camera',
  templateUrl: './edit-camera.component.html',
  styleUrls: ['./edit-camera.component.css']
})
export class EditCameraComponent implements OnInit {

  id: number;
  listPark: any[];

  itemCamera: any;

  constructor(private photoService: PhotoService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.itemCamera = this.photoService.getByIdCamera(this.id);

    this.getListPark();
  }

  getListPark() {
    this.photoService.getlistPark().subscribe(res => {
      this.listPark = res;
    });
  }


  editCamera(Camera: any) {
    this.photoService.editCamera(Camera).subscribe(res => {
      this.router.navigate(['dashboard', 'photo-view']);
    });
  }

}
