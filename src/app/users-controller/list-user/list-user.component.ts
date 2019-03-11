import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css'],
  providers: [UserService]
})
export class ListUserComponent implements OnInit {

  listUser: any[] = [];
  listPark: any[] = [];

  itemPark: any;
  itemUser:any = {user_id: 0, name: ''};

  all: boolean = true;
  private notifier: NotifierService;

  searchStr: string;
  constructor(private userService: UserService, notifierService: NotifierService, private router: Router, private route: ActivatedRoute) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.listUser = [];
    this.listPark = [];
    this.userService.getUsers().subscribe(response => {
      if (response.status === 'Ok') {
        for (let i = 0; response.data.users.length > i; i++) {
          this.listUser.push({user_id: response.data.users[i].user_id, login: response.data.users[i].login, name: response.data.users[i].name, fl_active: response.data.users[i].fl_active, parks: []});
          for (let j = 0; response.data.users[i].parks.length > j; j++) {
            this.listUser[i].parks.push(response.data.users[i].parks[j].name);
          }
        }
      }
    });

    this.userService.getParks().subscribe(response => {
      if(response.status === 'Ok') {
        this.listPark = response.data.parks;
      }
    });
  }

  onPark(park) {
    this.itemPark = park;
    this.all = false;
  }

  allUsers() {
    this.itemPark = null;
    this.all = true;
  }

  selectUser(user) {
    this.itemUser = user;
  }

  deleteUser() {
    this.userService.deleteUser(this.itemUser.user_id).subscribe(response => {
      if(response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

  editUser(id) {
    this.router.navigate([id], {relativeTo: this.route});
  }

}
