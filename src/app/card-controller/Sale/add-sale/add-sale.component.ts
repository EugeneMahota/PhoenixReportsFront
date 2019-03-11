import {Component, OnInit} from '@angular/core';
import {SaleService} from '../../sale.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CardService} from '../../card.service';

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.css']
})
export class AddSaleComponent implements OnInit {

  id: number;

  listPeriod: any[] = [];
  listGraphic: any[] = [];

  graphic_id: number;
  add_bonus: number = 0;
  add_money: number = 0;
  fl_add: any = false;
  fl_gift: any = false;
  fl_sale: any = false;
  period_act_card_id: number;
  price: number;
  value: number = 0;

  itemGroupRepl: any;
  constructor(private saleService: SaleService, private route: ActivatedRoute, private router: Router, private cardService: CardService) {
  }

  ngOnInit() {
    this.itemGroupRepl = this.cardService.getGroupRepl();

    this.id = +this.route.snapshot.paramMap.get('id');

    this.saleService.getListPeriod().subscribe(response => {
      if (response.status === 'Ok') {
        this.listPeriod = response.data;
      } else if (response.status === 'Error') {
        this.onBack();
      }
    });

    this.saleService.getListGraphic().subscribe(response => {
      let groupId: string = localStorage.getItem('groupId');
      for (let i = 0; response.data.length > i; i++) {
        if (response.data[i].id === groupId) {
          this.listGraphic = response.data[i].list;
        }
      }
    });
  }

  addSale(Sale) {
    this.saleService.addSale(Sale).subscribe(response => {
      if(response.status === 'Ok') {
        this.onBack();
      }
    });
  }

  onBack() {
    let id: number = +this.route.snapshot.paramMap.get('id');
    this.router.navigate(['dashboard', 'list-card', id, 'list-sale']);
  }

}
