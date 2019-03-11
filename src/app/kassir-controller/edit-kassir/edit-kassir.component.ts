import {Component, OnInit} from '@angular/core';
import {KassirService} from '../kassir.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-kassir',
  templateUrl: './edit-kassir.component.html',
  styleUrls: ['./edit-kassir.component.css']
})
export class EditKassirComponent implements OnInit {

  kassir_id: number;
  name: string;
  login: string;
  password1: string;
  password2: string;
  fl_active: boolean;

  itemGroupRepl: any;
  constructor(private kassirService: KassirService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.itemGroupRepl = this.kassirService.getGroupRepl();

    this.kassir_id = +this.route.snapshot.paramMap.get('id');

    this.kassirService.getKassir(this.kassir_id).subscribe(response => {
      if (response.status === 'Ok') {
        this.name = response.data.name;
        this.login = response.data.login;
        this.fl_active = response.data.fl_active;
      }
    });
  }


  editKassir(Kassir) {
    this.kassirService.editKassir(Kassir).subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard', 'list-kassir']);
      }
    });
  }

  editPassword(password) {
    this.kassirService.editPassword({id: this.kassir_id, password: password}).subscribe(response => {
      if (response.status === 'Ok') {}
    });
  }

}
