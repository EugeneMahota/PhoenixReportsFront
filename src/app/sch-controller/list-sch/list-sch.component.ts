import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SchService} from '../sch.service';
import {HubService} from '../../hub-controller/hub.service';

@Component({
  selector: 'app-list-sch',
  templateUrl: './list-sch.component.html',
  styleUrls: ['./list-sch.component.css']
})
export class ListSchComponent implements OnInit {

  id: number;

  listSch: any[] = [];
  itemSch: any = {sch_id: 0, ip_adr: ''};

  nameHub: string;

  itemPark: any;
  constructor(private route: ActivatedRoute, private router: Router, private schService: SchService, private hubService: HubService) {
  }

  ngOnInit() {
    this.itemPark = this.hubService.getPark();

    this.nameHub = localStorage.getItem('nameHub');

    this.id = +this.route.snapshot.paramMap.get('id');

    this.schService.getListSch(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        this.listSch = response.data;
      }
    });
  }

  selectSch(Sch) {
    this.itemSch = Sch;
  }

  deleteSch() {
    this.schService.deleteSch(this.itemSch.sch_id).subscribe(response => {
      if (response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

  editSch(id) {
    this.router.navigate([id], {relativeTo: this.route});
  }

}
