import {Component, OnInit} from '@angular/core';
import {AttrService} from '../attr.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DateTimeAdapter} from 'ng-pick-datetime';

@Component({
  selector: 'app-add-attr',
  templateUrl: './add-attr.component.html',
  styleUrls: ['./add-attr.component.css']
})
export class AddAttrComponent implements OnInit {

  listTypeSch: any[] = [];
  listHub: any[] = [];

  sch_id: number;
  type_sch_id: number;

  rep_name: string;
  fl_bonus: any = false;
  fl_active: any = true;
  fl_archive: any = false;
  val_bonus: number = 0;
  timeout_msg: number = 3000;
  timeout_green: number = 3000;
  timeout_red: number = 3000;
  timeout_rele_1: number = 0;
  timeout_rele_2: number = 0;
  interval_rele_1: number = 0;
  interval_rele_2: number = 0;
  time_action_sub: Date;

  display_name_array: any[] = [];

  itemPark: any;

  constructor(private attrService: AttrService,
              private route: ActivatedRoute,
              private router: Router,
              dateTimeAdapter: DateTimeAdapter<any>) {
    dateTimeAdapter.setLocale('Ru');
  }

  ngOnInit() {
    this.itemPark = this.attrService.getPark();

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

  addAttr(Attr) {
    for (let i = 0; i < 32; i++) {
      if (this.display_name_array[i] === undefined || this.display_name_array[i].length === 0) {
        this.display_name_array[i] = ' ';
      }
    }

    Attr.display_name = Attr.display_name.join('');

    console.log(Attr);
    this.attrService.addAttr(Attr).subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard', 'list-attr']);
      }
    });
  }

}
