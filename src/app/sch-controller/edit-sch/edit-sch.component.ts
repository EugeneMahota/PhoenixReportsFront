import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SchService} from '../sch.service';
import {HubService} from '../../hub-controller/hub.service';

@Component({
  selector: 'app-edit-sch',
  templateUrl: './edit-sch.component.html',
  styleUrls: ['./edit-sch.component.css']
})
export class EditSchComponent implements OnInit {

  id: number;

  ip_adr: string;
  pass: number;
  timeout_sleep: number;
  fl_one_pass: any;
  rele_1: any;
  rele_2: any;

  brig_ledR: string;
  brig_ledG: string;
  brig_ledB: string;

  nameHub: string;

  itemPark: any;
  constructor(private route: ActivatedRoute, private router: Router, private schService: SchService, private hubService: HubService) {
  }

  ngOnInit() {
    this.itemPark = this.hubService.getPark();

    this.id = +this.route.snapshot.paramMap.get('sch_id');

    this.nameHub = localStorage.getItem('nameHub');

    this.schService.getSch(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        this.ip_adr = response.data.ip_adr;
        this.pass = response.data.pass;
        this.timeout_sleep = response.data.timeout_sleep;
        this.fl_one_pass = response.data.fl_one_pass;
        this.rele_1 = response.data.rele_1;
        this.rele_2 = response.data.rele_2;

        this.brig_ledR = response.data.brig_led.charAt(0);
        this.brig_ledG = response.data.brig_led.charAt(1);
        this.brig_ledB = response.data.brig_led.charAt(2);
      }
    });
  }

  editSch(Sch) {
    this.schService.editSch(Sch).subscribe(response => {
      if (response.status === 'Ok') {
        this.onBack();
      }
    });
  }

  onBack() {
    let id: number = +this.route.snapshot.paramMap.get('id');
    this.router.navigate(['dashboard', 'list-hub', id, 'list-sch']);
  }

}
