import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PriceService} from '../price.service';
import {AttrService} from '../../attr-controller/attr.service';

@Component({
  selector: 'app-add-price',
  templateUrl: './add-price.component.html',
  styleUrls: ['./add-price.component.css']
})
export class AddPriceComponent implements OnInit {

  id: number;

  listCard: any[] = [];
  listGraphic: any[] = [];

  graphic_id: number;
  type_card_id: number;
  price: number;
  bonus: number;

  itemAttr: any;
  itemPark: any;

  constructor(private router: Router, private route: ActivatedRoute, private priceService: PriceService, private attrService: AttrService) {
  }

  ngOnInit() {
    this.itemPark = this.attrService.getPark();
    this.itemAttr = this.attrService.getItemAttr();

    this.id = +this.route.snapshot.paramMap.get('id');

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
  }

  addPrice(Price) {
    this.priceService.addPrice(Price).subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard', 'list-attr', this.id, 'list-price']);
      }
    });
  }

}
