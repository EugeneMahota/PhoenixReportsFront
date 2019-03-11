import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CardService} from '../card.service';
import {KassirService} from '../../kassir-controller/kassir.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {

  group_id: string;
  name_type_card: string;
  fl_default: any = false;

  listGroup:any[] = [];
  constructor(private router: Router, private cardService: CardService, private kassirService: KassirService) {
  }

  ngOnInit() {
    this.kassirService.getGroup().subscribe(response => {
      if(response.status === 'Ok') {
        this.listGroup = response.data;
      }
    });
  }

  addCard(Card) {
    this.cardService.addCard(Card).subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard', 'list-card']);
      }
    });
  }

}
