import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BonusService} from '../../bonus.service';
import {CardService} from '../../card.service';

@Component({
  selector: 'app-edit-bonus',
  templateUrl: './edit-bonus.component.html',
  styleUrls: ['./edit-bonus.component.css']
})
export class EditBonusComponent implements OnInit {

  id: number;
  val_bon: number;
  val_start: number;
  val_end: number;

  itemGroupRepl: any;
  constructor(private router: Router, private bonusService: BonusService, private route: ActivatedRoute, private cardService: CardService) {
  }

  ngOnInit() {
    this.itemGroupRepl = this.cardService.getGroupRepl();

    this.id = +this.route.snapshot.paramMap.get('bon_id');

    this.bonusService.getBonus(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        this.val_bon = response.data.val_bon;
        this.val_start = response.data.val_start;
        this.val_end = response.data.val_end;
      } else if (response.status === 'Error') {
        this.onBack();
      }
    });
  }

  editBonus(Bonus) {
    this.bonusService.editBonus(Bonus).subscribe(response => {
      if (response.status === 'Ok') {
        this.onBack();
      }
    });
  }

  onBack() {
    let id: number = +this.route.snapshot.paramMap.get('id');
    this.router.navigate(['dashboard', 'list-card', id, 'list-bonus']);
  }

}
