import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SchService} from '../sch.service';
import {HubService} from '../../hub-controller/hub.service';

@Component({
  selector: 'app-add-sch',
  templateUrl: './add-sch.component.html',
  styleUrls: ['./add-sch.component.css']
})
export class AddSchComponent implements OnInit {


  id: number;

  ip_adr: string;
  pass: number;
  timeout_sleep: number = 5;
  fl_one_pass: any = true;
  rele_1: any = false;
  rele_2: any = false;

  brig_ledR: string = '0';
  brig_ledG: string = '0';
  brig_ledB: string = '0';

  nameHub: string;

  itemPark: any;
  constructor(private route: ActivatedRoute, private router: Router, private schService: SchService, private hubService: HubService) {
  }

  ngOnInit() {
    this.itemPark = this.hubService.getPark();

    this.id = +this.route.snapshot.paramMap.get('id');

    this.nameHub = localStorage.getItem('nameHub');
  }

  addSch(Sch) {
    this.schService.addSch(Sch).subscribe(response => {
      if (response.status === 'Ok') {
        this.onBack();
      }
    });
  }


  onBack() {
    this.router.navigate(['dashboard', 'list-hub', this.id, 'list-sch']);
  }
}
