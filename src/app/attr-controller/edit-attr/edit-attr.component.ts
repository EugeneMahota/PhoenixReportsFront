import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AttrService} from '../attr.service';
import {rS} from '@angular/core/src/render3';
import {DateTimeAdapter} from 'ng-pick-datetime';

@Component({
  selector: 'app-edit-attr',
  templateUrl: './edit-attr.component.html',
  styleUrls: ['./edit-attr.component.css']
})
export class EditAttrComponent implements OnInit {

  id: number;

  listHub: any[] = [];
  listTypeSch: any[] = [];

  sch_id: number;
  type_sch_id: number;

  rep_name: string;
  fl_bonus: any;
  fl_active: any;
  fl_archive: any;
  val_bonus: number;
  timeout_msg: number;
  timeout_green: number;
  timeout_red: number;
  timeout_rele_1: number;
  timeout_rele_2: number;
  interval_rele_1: number;
  interval_rele_2: number;
  time_action_sub: Date;

  display_name_array: any[] = [];


  null = null;
  itemPark: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private attrService: AttrService,
              dateTimeAdapter: DateTimeAdapter<any>) {
    dateTimeAdapter.setLocale('Ru');
  }

  ngOnInit() {
    this.itemPark = this.attrService.getPark();

    this.id = +this.route.snapshot.paramMap.get('id');

    this.attrService.getAttr(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        this.sch_id = response.data.sch_id;
        this.type_sch_id = response.data.type_sch_id;
        this.rep_name = response.data.rep_name;
        this.fl_bonus = response.data.fl_bonus;
        this.fl_active = response.data.fl_active;
        this.fl_archive = response.data.fl_archive;
        this.val_bonus = response.data.val_bonus;
        this.timeout_msg = response.data.timeout_msg;
        this.timeout_green = response.data.timeout_green;
        this.timeout_red = response.data.timeout_red;
        this.timeout_rele_1 = response.data.timeout_rele_1;
        this.timeout_rele_2 = response.data.timeout_rele_2;
        this.interval_rele_1 = response.data.interval_rele_1;
        this.interval_rele_2 = response.data.interval_rele_2;
        if (response.data.time_action_sub) {
          this.time_action_sub = new Date(0, 0, 0, +response.data.time_action_sub.slice(0, 2), +response.data.time_action_sub.slice(3, 5), 0);
        }

        this.display_name_array = response.data.display_name.split('');
      }
    });

    this.attrService.getListTypeSch().subscribe(response => {
      if (response.status === 'Ok') {
        this.listTypeSch = response.data;
      }
    });
    this.attrService.getListSch().subscribe(response => {
      let listSch: any;
      let Park: any = this.attrService.getPark();
      if (response.status === 'Ok') {
        listSch = response.data.find(x => x.id === Park.park_id).list;

        let listHub: any[] = [];
        for (let i = 0; listSch.length > i; i++) {
          if (listHub.indexOf(listSch[i].ip_adr.slice(0, 3)) === -1) {
            listHub.push(listSch[i].ip_adr.slice(0, 3));
            this.listHub.push({hub: listSch[i].ip_adr.slice(0, 3), list: []});
          }
        }
        for (let i = 0; this.listHub.length > i; i++) {
          for (let j = 0; listSch.length > j; j++) {
            if (this.listHub[i].hub === listSch[j].ip_adr.slice(0, 3)) {
              this.listHub[i].list.push(listSch[j]);
            }
          }
        }
      }
    });

  }

  editAttr(Attr) {
    for (let i = 0; i < 32; i++) {
      if (this.display_name_array[i] === undefined || this.display_name_array[i].length === 0) {
        this.display_name_array[i] = ' ';
      }
    }

    Attr.display_name = Attr.display_name.join('');

    this.attrService.editAttr(Attr).subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard', 'list-attr']);
      }
    });
  }

}
