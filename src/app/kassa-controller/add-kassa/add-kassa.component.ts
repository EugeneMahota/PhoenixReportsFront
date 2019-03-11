import {Component, OnInit} from '@angular/core';
import {KassaService} from '../kassa.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-add-kassa',
  templateUrl: './add-kassa.component.html',
  styleUrls: ['./add-kassa.component.css'],
  providers: [KassaService]
})
export class AddKassaComponent implements OnInit {


  park_id: number;
  name: string;
  ip_adr: string;
  pos: any = false;
  kkm: any = false;
  skip: number = 0;

  listPark: any[] = [];


  constructor(private kassaService: KassaService, private router: Router) {

  }

  ngOnInit() {
    this.kassaService.getGroupPark().subscribe(response => {
      if (response.status === 'Ok') {
        this.listPark = response.data;
      }
    });
  }

  addKassa(Kassa) {
    this.kassaService.addKassa(Kassa).subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard', 'list-kassa']);
      }
    });
  }

}
