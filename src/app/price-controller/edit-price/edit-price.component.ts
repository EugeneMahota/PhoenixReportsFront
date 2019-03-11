import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PriceService} from '../price.service';
import {AttrService} from '../../attr-controller/attr.service';

@Component({
  selector: 'app-edit-price',
  templateUrl: './edit-price.component.html',
  styleUrls: ['./edit-price.component.css']
})
export class EditPriceComponent implements OnInit {

  id: number;

  listCard: any[] = [];
  listGraphic: any[] = [];

  graphic_id: number;
  type_card_id: number;
  price: number;
  bonus: number;

  itemAttr: any;
  itemPark: any;
  constructor(private route: ActivatedRoute, private router: Router, private priceService: PriceService, private attrService: AttrService) {
  }

  ngOnInit() {
    this.itemPark = this.attrService.getPark();
    this.itemAttr = this.attrService.getItemAttr();

    this.id = +this.route.snapshot.paramMap.get('price_id');

    this.priceService.getListCard().subscribe(response => {
      if (response.status === 'Ok') {
        for (let i = 0; response.data.length > i; i++) {
          if (response.data[i].id === this.itemAttr.ex_group) {
            this.listCard = response.data[i].list;
          }
        }
      }
    });

    this.priceService.getListGraphic().subscribe(response => {
      if (response.status === 'Ok') {
        for (let i = 0; response.data.length > i; i++) {
          if (response.data[i].id === this.itemAttr.ex_group) {
            this.listGraphic = response.data[i].list;
          }
        }
      }
    });

    this.priceService.getPrice(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        this.graphic_id = response.data.graphic_id;
        this.type_card_id = response.data.type_card_id;
        this.price = response.data.price;
        this.bonus = response.data.bonus;
      }
    });
  }

  editPrice(Price) {
    this.priceService.editPrice(Price).subscribe(response => {
      if (response.status === 'Ok') {
        this.onBack();
      }
    });
  }

  onBack() {
    let id: number = +this.route.snapshot.paramMap.get('id');
    this.router.navigate(['dashboard', 'list-attr', id, 'list-price']);
  }

}
