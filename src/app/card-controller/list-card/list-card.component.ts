import {Component, OnInit} from '@angular/core';
import {CardService} from '../card.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.css']
})
export class ListCardComponent implements OnInit {

  listCard: any[] = [];
  itemCard: any = {type_card_id: 0, name_type_card: ''};

  listGroupRepl: any[] = [];
  itemGroupRepl: any = {id: 0, name: ''};

  constructor(private cardService: CardService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.cardService.getListCard().subscribe(response => {
      if (response.status === 'Ok') {
        this.listGroupRepl = response.data;
        if(this.cardService.getGroupRepl()) {
          this.selectGroup(this.cardService.getGroupRepl());
        } else {
          this.selectGroup(response.data[0]);
        }
      }
    });
  }

  selectCard(Card) {
    this.itemCard = Card;
  }

  deleteCard() {
    this.cardService.deleteCard(this.itemCard.type_card_id).subscribe(response => {
      if (response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

  editCard(id) {
    this.router.navigate([id], {relativeTo: this.route});
  }

  listBonus(Card, groupId) {
    localStorage.setItem('groupId', groupId);
    localStorage.setItem('nameCard', Card.name_type_card);
    this.router.navigate([Card.type_card_id, 'list-bonus'], {relativeTo: this.route});
  }

  listSale(Card, groupId) {
    localStorage.setItem('groupId', groupId);
    localStorage.setItem('nameCard', Card.name_type_card);
    this.router.navigate([Card.type_card_id, 'list-sale'], {relativeTo: this.route});
  }

  selectGroup(Group) {
    let list = this.listGroupRepl.find(x => x.id === Group.id);
    if(list) {
      this.listCard = list.list;
      this.itemGroupRepl = list;
      this.cardService.saveGroupRepl(list);
    } else if(this.listGroupRepl.length != 0) {
      this.listCard = this.listGroupRepl[0].list;
      this.itemGroupRepl = this.listGroupRepl[0];
      this.cardService.saveGroupRepl(this.listGroupRepl[0]);
    } else {
      this.listCard = [];
    }
  }

}
