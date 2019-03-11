import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HubService} from '../hub.service';

@Component({
  selector: 'app-list-hub',
  templateUrl: './list-hub.component.html',
  styleUrls: ['./list-hub.component.css']
})
export class ListHubComponent implements OnInit {

  listHub: any[] = [];
  itemHub: any = {hub_id: 0, name: ''};

  listPark: any[] = [];
  itemPark: any;

  constructor(private router: Router, private route: ActivatedRoute, private hubService: HubService) {
  }

  ngOnInit() {
    this.hubService.getListHub().subscribe(response => {
      if (response.status === 'Ok') {
        this.listPark = response.data;
        if (this.hubService.getPark()) {
          this.selectPark(this.hubService.getPark());
        } else {
          this.selectPark(response.data[0]);
        }
      }
    });
  }

  selectHub(Hub) {
    this.itemHub = Hub;
  }

  deleteHub() {
    this.hubService.deleteHub(this.itemHub.hub_id).subscribe(response => {
      if (response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

  editHub(id) {
    this.router.navigate([id], {relativeTo: this.route});
  }

  listSch(Hub) {
    localStorage.setItem('nameHub', Hub.name);
    this.router.navigate([Hub.hub_id, 'list-sch'], {relativeTo: this.route});
  }

  selectPark(Park) {
    let list = this.listPark.find(x => x.id === Park.id);
    if (list) {
      this.listHub = list.list;
      this.itemPark = list.name;
      this.hubService.savePark(list);
    } else if(this.listPark.length != 0) {
      this.listHub = this.listPark[0].list;
      this.itemPark = this.listPark[0].name;
      this.hubService.savePark(this.listPark[0]);
    } else {
      this.listHub = [];
    }
  }

}
