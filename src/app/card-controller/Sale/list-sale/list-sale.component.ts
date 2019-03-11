import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SaleService} from '../../sale.service';
import {CardService} from '../../card.service';

@Component({
  selector: 'app-list-sale',
  templateUrl: './list-sale.component.html',
  styleUrls: ['./list-sale.component.css']
})
export class ListSaleComponent implements OnInit {

  id: number;

  listSale: any[] = [];
  itemSale: any = {sale_id: 0, name:''};

  nameCard: string;

  itemGroupRepl: any;
  constructor(private route: ActivatedRoute, private router: Router, private saleService: SaleService, private cardService: CardService) {
  }

  ngOnInit() {
    this.itemGroupRepl = this.cardService.getGroupRepl();

    this.nameCard = localStorage.getItem('nameCard');

    this.id = +this.route.snapshot.paramMap.get('id');

    this.saleService.getListSale(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        this.listSale = response.data;
      }
    });
  }

  selectSale(Sale) {
    this.itemSale = Sale;
  }

  deleteSale() {
    this.saleService.deleteSale(this.itemSale.sale_id).subscribe(response => {
      if(response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

  editSale(id) {
    this.router.navigate([id], {relativeTo: this.route});
  }


}
