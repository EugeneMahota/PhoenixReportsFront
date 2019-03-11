import {Component, OnInit} from '@angular/core';
import {KassaService} from '../../kassa-report-controller/kassa.service';
import {KassirService} from '../kassir.service';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-list-kassir',
  templateUrl: './list-kassir.component.html',
  styleUrls: ['./list-kassir.component.css'],
  providers: [KassaService]
})
export class ListKassirComponent implements OnInit {

  listGroupRepl: any[] = [];
  itemGroupRepl: any = {};

  listKassir: any[] = [];
  itemKassir: any = {kassir_id: 0, name: ''};

  searchStr: string;
  constructor(private kassirService: KassirService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.kassirService.getListKassir().subscribe(response => {
      if (response.status === 'Ok') {
        this.listGroupRepl = response.data;
        if(this.kassirService.getGroupRepl()) {
          this.selectGroup(this.kassirService.getGroupRepl());
        } else {
          this.selectGroup(response.data[0]);
        }
      }
    });
  }

  editKassir(Kassir) {
    this.router.navigate([Kassir.kassir_id], {relativeTo: this.route});
  }

  selectKassir(Kassir) {
    this.itemKassir = Kassir;
  }

  deleteKassir() {
    this.kassirService.deleteKassir(this.itemKassir.kassir_id).subscribe(response => {
      if (response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

  selectGroup(Group) {
    let list = this.listGroupRepl.find(x => x.id === Group.id);
    if(list) {
      this.listKassir = list.data;
      this.itemGroupRepl = list.name;
      this.kassirService.saveGroupRepl(list);
    } else if(this.listGroupRepl.length != 0) {
      this.listKassir = this.listGroupRepl[0].data;
      this.itemGroupRepl = this.listGroupRepl[0].name;
      this.kassirService.saveGroupRepl(this.listGroupRepl[0]);
    } else {
      this.listKassir = [];
    }
  }

}
