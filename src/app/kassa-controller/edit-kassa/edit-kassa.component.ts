import {Component, OnInit} from '@angular/core';
import {KassaService} from '../kassa.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-kassa',
  templateUrl: './edit-kassa.component.html',
  styleUrls: ['./edit-kassa.component.css']
})
export class EditKassaComponent implements OnInit {

  id: number;
  name: string;
  ip_adr: string;
  pos: any;
  kkm: any;
  skip: number = 0;

  itemPark: any;
  constructor(private kassaService: KassaService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.itemPark = this.kassaService.getPark();

    this.id = +this.route.snapshot.paramMap.get('id');

    this.kassaService.getKassa(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        this.ip_adr = response.data.ip_adr;
        this.name = response.data.name;
        this.skip = +response.data.skip;
        this.pos = +response.data.pos;
        this.kkm = +response.data.kkm;
      }
    });
  }

  editKassa(Kassa) {
    this.kassaService.editKassa(Kassa).subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard', 'list-kassa']);
      }
    });
  }

}
