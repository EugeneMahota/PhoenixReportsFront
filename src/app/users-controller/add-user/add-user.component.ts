import {Component, OnInit} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {UserService} from '../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  name: string;
  login: string;
  email: string = '';
  phone: string;
  fl_active: any = true;
  password1: string;
  password2: string;

  listRole: any[] = [];
  listPark: any[] = [];

  settingsRole = {
    text: 'Роли не выбраны',
    selectAllText: 'Выбрать все роли',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    enableSearchFilter: true,
    searchPlaceholderText: ' Поиск',
    badgeShowLimit: 3,
    filterUnSelectAllText: 'Выбрать все',
    filterSelectAllText: 'Выбрать все',
    noDataLabel: 'Список пуст'
  };
  settingsPark = {
    text: 'Парки не выбраны',
    selectAllText: 'Выбрать все парки',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    enableSearchFilter: true,
    searchPlaceholderText: ' Поиск',
    badgeShowLimit: 3,
    filterUnSelectAllText: 'Выбрать все',
    filterSelectAllText: 'Выбрать все',
    noDataLabel: 'Список пуст'
  };

  listRoleActive: any[] = [];
  listParkActive: any[] = [];

  private readonly notifier: NotifierService;
  constructor(notifierService: NotifierService, private userService: UserService, private router: Router) {
    this.notifier = notifierService;
  }

  ngOnInit() {

    this.userService.getOptions().subscribe(response => {
      if (response.status === 'Ok') {

        for (let i = 0; response.data.roles.length > i; i++) {
          this.listRole.push({id: response.data.roles[i].role_id, itemName: response.data.roles[i].name_role, displayName: response.data.roles[i].name_display});
        }

        for (let i = 0; response.data.parks.length > i; i++) {
          this.listPark.push({id: response.data.parks[i].park_id, itemName: response.data.parks[i].name});
        }

      }
    });
  }

  addUser(addUser) {
    if (this.password1 != this.password2) {
      this.notifier.notify('error', 'Пароли не совпадают!');
    } else {
      this.userService.addUser(addUser).subscribe(response => {
        if (response.status === 'Ok') {
          this.router.navigate(['dashboard', 'list-user']);
        }
      });
    }
  }

}
