import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PriceService} from '../price.service';
import {AttrService} from '../../attr-controller/attr.service';

@Component({
  selector: 'app-list-price',
  templateUrl: './list-price.component.html',
  styleUrls: ['./list-price.component.css']
})
export class ListPriceComponent implements OnInit {

  id: number;

  listPrice: any[] = [];
  itemPrice: any = {price_attr_id: 0};

  itemAttr: any;

  itemPark: any;
  constructor(private route: ActivatedRoute, private router: Router, private priceService: PriceService, private attrService: AttrService) {
  }

  ngOnInit() {
    this.itemPark = this.attrService.getPark();
    this.itemAttr = this.attrService.getItemAttr();

    this.id = +this.route.snapshot.paramMap.get('id');

    this.priceService.getListPrice(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        this.listPrice = response.data;
      }
    });
  }

  selectPrice(Price) {
    this.itemPrice = Price;
  }

  deletePrice() {
    this.priceService.deletePrice(this.itemPrice.price_attr_id).subscribe(response => {
      if (response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

  editPrice(id) {
    this.router.navigate([id], {relativeTo: this.route});
  }

}
