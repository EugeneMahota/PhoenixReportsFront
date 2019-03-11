import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HubService} from '../hub.service';

@Component({
  selector: 'app-add-hub',
  templateUrl: './add-hub.component.html',
  styleUrls: ['./add-hub.component.css']
})
export class AddHubComponent implements OnInit {

  ip_adr: string;
  name: string;
  group_id: number;

  listGroup: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private hubService: HubService) {
  }

  ngOnInit() {
    this.hubService.getGroup().subscribe(response => {
      if(response.status === 'Ok') {
        this.listGroup = response.data;
      }
    });
  }

  addHub(Hub) {
    this.hubService.addHub(Hub).subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard', 'list-hub']);
      }
    });
  }

}
