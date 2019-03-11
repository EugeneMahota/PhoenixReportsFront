import {Component, OnInit} from '@angular/core';
import {SaleService} from '../../sale.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CardService} from '../../card.service';

@Component({
  selector: 'app-edit-sale',
  templateUrl: './edit-sale.component.html',
  styleUrls: ['./edit-sale.component.css']
})
export class EditSaleComponent implements OnInit {

  id: number;

  listPeriod: any[] = [];
  listGraphic: any[] = [];

  graphic_id: number;
  add_bonus: number;
  add_money: number;
  fl_add: any;
  fl_gift: any;
  fl_sale: any;
  period_act_card_id: number;
  price: number;
  value: number;

  itemGroupRepl: any;
  constructor(private saleService: SaleService, private router: Router, private route: ActivatedRoute, private cardService: CardService) {
  }

  ngOnInit() {
    this.itemGroupRepl = this.cardService.getGroupRepl();

    this.id = +this.route.snapshot.paramMap.get('sale_id');

    this.saleService.getSale(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        this.graphic_id = response.data.graphic_id;
        this.add_bonus = response.data.add_bonus;
        this.add_money = response.data.add_money;
        this.fl_add = +response.data.fl_add;
        this.fl_gift = +response.data.fl_gift;
        this.fl_sale = +response.data.fl_sale;
        this.period_act_card_id = response.data.period_act_card_id;
        this.price = response.data.price;
        this.value = response.data.value;
      } else if (response.status === 'Error') {
        this.onBack();
      }
    });

    this.saleService.getListPeriod().subscribe(response => {
      if (response.status === 'Ok') {
        this.listPeriod = response.data;
      } else if (response.status === 'Error') {
        this.onBack();
      }
    });

    this.saleService.getListGraphic().subscribe(response => {
      let groupId: string = localStorage.getItem('groupId');
      for(let i = 0; response.data.length > i; i++) {
        if(response.data[i].id === groupId) {
          this.listGraphic = response.data[i].list;
        }
      }
    });
  }

  editSale(Sale) {
    this.saleService.editSale(Sale).subscribe(response => {
      if (response.status === 'Ok') {
        this.onBack();
      }
    });
  }

  onBack() {
    let id: number = +this.route.snapshot.paramMap.get('id');
    this.router.navigate(['dashboard', 'list-card', id, 'list-sale']);
  }

}
