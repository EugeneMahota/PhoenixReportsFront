import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BonusService} from '../../bonus.service';
import {CardService} from '../../card.service';

@Component({
  selector: 'app-list-bonus',
  templateUrl: './list-bonus.component.html',
  styleUrls: ['./list-bonus.component.css']
})
export class ListBonusComponent implements OnInit {

  id: number;

  listBonus: any[] = [];
  itemBonus: any = {bonus_id: 0};

  nameCard: string;

  itemGroupRepl: any;
  constructor(private router: Router, private route: ActivatedRoute, private bonusService: BonusService, private cardService: CardService) {
  }

  ngOnInit() {
    this.itemGroupRepl = this.cardService.getGroupRepl();

    this.nameCard = localStorage.getItem('nameCard');

    this.id = +this.route.snapshot.paramMap.get('id');

    this.bonusService.getListBonus(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        this.listBonus = response.data;
      }
    });
  }

  selectBonus(Bonus) {
    this.itemBonus = Bonus;
  }

  deleteBonus() {
    this.bonusService.deleteBonus(this.itemBonus.bonus_id).subscribe(response => {
      if (response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

  editBonus(id) {
    this.router.navigate([id], {relativeTo: this.route});
  }

}
