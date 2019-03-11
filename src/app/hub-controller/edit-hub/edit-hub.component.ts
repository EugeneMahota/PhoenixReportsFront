import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HubService} from '../hub.service';

@Component({
  selector: 'app-edit-hub',
  templateUrl: './edit-hub.component.html',
  styleUrls: ['./edit-hub.component.css']
})
export class EditHubComponent implements OnInit {

  id: number;
  ip_adr: string;
  name: string;

  itemPark: any;
  constructor(private router: Router, private route: ActivatedRoute, private hubService: HubService) {
  }

  ngOnInit() {
    this.itemPark = this.hubService.getPark();

    this.id = +this.route.snapshot.paramMap.get('id');

    this.hubService.getHub(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        this.ip_adr = response.data.ip_adr;
        this.name = response.data.name;
      }
    });
  }

  editHub(Hub) {
    this.hubService.editHub(Hub).subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard', 'list-hub']);
      }
    });
  }

}
