import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AttrService} from '../attr.service';

@Component({
  selector: 'app-list-attr',
  templateUrl: './list-attr.component.html',
  styleUrls: ['./list-attr.component.css']
})
export class ListAttrComponent implements OnInit {

  listPark: any[] = [];
  itemPark: any = {park_id: 0, name: '', ex_group: ''};

  listAttr: any[] = [];
  listAttrAll: any[] = [];
  itemAttr: any = {attr_id: 0, rep_name: ''};

  listCardAll: any[] = [];
  listCard: any[] = [];
  type_card_id: number;
  date: string;
  searchStr: string;

  reverse: boolean = false;
  order: string = 'ip_adr';
  constructor(private router: Router, private route: ActivatedRoute, private attrService: AttrService) {
  }

  ngOnInit() {
    this.attrService.getListAttr().subscribe(response => {
      if (response.status === 'Ok') {
        this.listAttrAll = response.data;

        this.attrService.getListPark().subscribe(response => {
          if (response.status === 'Ok') {
            this.listPark = response.data;
            if (this.attrService.getPark()) {
              this.selectPark(this.attrService.getPark());
            } else {
              this.selectPark(response.data[0]);
            }
          }
        });

      }
    });

    this.attrService.getListCard().subscribe(response => {
      if (response.status === 'Ok') {
        this.listCardAll = response.data;
      }
    });
  }

  selectAttr(Attr) {
    this.itemAttr = Attr;
  }

  selectPark(Park) {
    this.listAttr = [];
    this.itemPark = Park;
    for (let i = 0; this.listAttrAll.length > i; i++) {
      if (+this.listAttrAll[i].id === +Park.park_id) {
        this.listAttr = this.listAttrAll[i].list;
      }
    }
    this.attrService.savePark(Park);

    for (let i = 0; this.listCardAll.length > i; i++) {
      if (this.listCardAll[i].id === Park.ex_group) {
        this.listCard = this.listCardAll[i].list;
      }
    }
  }

  deleteAttr() {
    this.attrService.deleteAttr(this.itemAttr.attr_id).subscribe(response => {
      if (response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

  editAttr(id) {
    this.router.navigate([id], {relativeTo: this.route});
  }

  listPrice(Attr) {
    this.attrService.saveAttr(Attr);
    this.router.navigate([Attr.attr_id, 'list-price'], {relativeTo: this.route});
  }

  getPrice(Param) {
    Param.date = Param.date.replace('T', ' ');
    console.log(Param);
    this.attrService.getPrice(Param).subscribe(response => {
      if (response.status === 'Ok') {
        this.listAttr = response.data;
        console.log(response);
      }
    });
  }

  setOrder(value) {
    if (value === this.order) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

}
