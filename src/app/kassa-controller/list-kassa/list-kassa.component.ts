import {Component, OnInit} from '@angular/core';
import {KassaService} from '../kassa.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-list-kassa',
  templateUrl: './list-kassa.component.html',
  styleUrls: ['./list-kassa.component.css'],
  providers: []
})
export class ListKassaComponent implements OnInit {

  listPark: any[] = [];
  itemPark: any;

  listKassa: any[] = [];
  itemKassa: any = {kassa_id: 0, name: ''};

  constructor(private kassaService: KassaService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.kassaService.getListKassa().subscribe(response => {
      if (response.status === 'Ok') {
        this.listPark = response.data;
        if(this.kassaService.getPark()) {
          this.selectPark(this.kassaService.getPark());
        } else {
          this.selectPark(response.data[0]);
        }
      }
    });
  }

  editKassa(Kassa) {
    this.router.navigate([Kassa.kassa_id], {relativeTo: this.route});
  }

  selectKassa(Kassa) {
    this.itemKassa = Kassa;
  }

  deleteKassa() {
    this.kassaService.deleteKassa(this.itemKassa.kassa_id).subscribe(response => {
      if (response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

  selectPark(Park) {
    let list = this.listPark.find(x => x.id === Park.id);
    if(list) {
      this.listKassa = list.list;
      this.itemPark = list.name;
      this.kassaService.savePark(list);
    } else if(this.listPark.length != 0) {
      this.listKassa = this.listPark[0].list;
      this.itemPark = this.listPark[0].name;
      this.kassaService.savePark(this.listPark[0]);
    } else {
      this.listKassa = [];
    }
  }

}
