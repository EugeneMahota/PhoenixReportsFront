import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BonusService} from '../../bonus.service';
import {CardService} from '../../card.service';

@Component({
  selector: 'app-add-bonus',
  templateUrl: './add-bonus.component.html',
  styleUrls: ['./add-bonus.component.css']
})
export class AddBonusComponent implements OnInit {

  id: number;
  val_start: number;
  val_end: number;
  val_bon: number;

  itemGroupRepl: any;
  constructor(private route: ActivatedRoute, private router: Router, private bonusService: BonusService, private cardService: CardService) {
  }

  ngOnInit() {
    this.itemGroupRepl = this.cardService.getGroupRepl();

    this.id = +this.route.snapshot.paramMap.get('id');
  }

  addBonus(Bonus) {
    this.bonusService.addBonus(Bonus).subscribe(response => {
      if (response.status === 'Ok') {
        this.onBack();
      }
    });
  }

  onBack() {
    this.router.navigate(['dashboard', 'list-card', this.id, 'list-bonus']);
  }

}
