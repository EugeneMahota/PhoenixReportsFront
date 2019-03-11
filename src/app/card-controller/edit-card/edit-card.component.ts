import {Component, OnInit} from '@angular/core';
import {CardService} from '../card.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.css']
})
export class EditCardComponent implements OnInit {

  id: number;
  name_type_card: string;
  fl_default: any;

  itemGroupRepl: any;
  constructor(private cardService: CardService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.itemGroupRepl = this.cardService.getGroupRepl();

    this.id = +this.route.snapshot.paramMap.get('id');

    this.cardService.getCard(this.id).subscribe(response => {
      this.name_type_card = response.data.name_type_card;
      this.fl_default = +response.data.fl_default;
    });
  }

  editCard(Card) {
    this.cardService.editCard(Card).subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard', 'list-card']);
      }
    });
  }

}
