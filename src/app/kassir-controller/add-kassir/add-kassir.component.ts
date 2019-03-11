import {Component, OnInit} from '@angular/core';
import {KassirService} from '../kassir.service';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-kassir',
  templateUrl: './add-kassir.component.html',
  styleUrls: ['./add-kassir.component.css'],
  providers: [KassirService]
})
export class AddKassirComponent implements OnInit {

  name: string;
  login: string;
  password1: string;
  password2: string;
  fl_active: boolean = true;
  ex_group: string;

  listGroup: any[] = [];

  constructor(private kassirService: KassirService, private router: Router) {
  }

  ngOnInit() {
    this.kassirService.getGroup().subscribe(response => {
      if (response.status === 'Ok') {
        this.listGroup = response.data;
      }
    });
  }

  addKassir(Kassir) {
    this.kassirService.addKassir(Kassir).subscribe(response => {
      if(response.status === "Ok") {
        this.router.navigate(['dashboard', 'list-kassir']);
      }
    });
  }

}
