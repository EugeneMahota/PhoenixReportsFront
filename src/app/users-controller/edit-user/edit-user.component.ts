import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  providers: [UserService]
})
export class EditUserComponent implements OnInit {

  id: number;

  listPark: any[] = [];
  listRole: any[] = [];

  listParkActive: any[] = [];
  listRoleActive: any[] = [];

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

  userInfo: any = {login: '', name: '', email: '', phone: '', fl_active: false};

  name: string;
  email: string;
  phone: string;
  fl_active: any;

  password1: string;
  password2: string;

  private notifier: NotifierService;
  constructor(private route: ActivatedRoute, private userService: UserService, notifierService: NotifierService, private router: Router) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');

    this.userService.getUser(this.id).subscribe(response => {

      this.name = response.data.info.name;
      this.email = response.data.info.email || '';
      this.phone = response.data.info.phone || '';
      this.fl_active = response.data.info.fl_active;

      this.userInfo = response.data.info;
      for (let i = 0; response.data.parks.length > i; i++) {
        this.listParkActive.push({id: response.data.parks[i].park_id, itemName: response.data.parks[i].name});
      }
      for (let i = 0; response.data.roles.length > i; i++) {
        this.listRoleActive.push({id: response.data.roles[i].role_id, itemName: response.data.roles[i].name_role});
      }
    });

    this.userService.getOptions().subscribe(response => {
      if (response.status === 'Ok') {

        for (let i = 0; response.data.roles.length > i; i++) {
          this.listRole.push({
            id: response.data.roles[i].role_id,
            itemName: response.data.roles[i].name_role,
            displayName: response.data.roles[i].name_display
          });
        }

        for (let i = 0; response.data.parks.length > i; i++) {
          this.listPark.push({id: response.data.parks[i].park_id, itemName: response.data.parks[i].name});
        }

      }
    });
  }

  editUser(editUser) {
    this.userService.editUser(editUser).subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard', 'list-user']);
      }
    });
  }

  editPassword(password) {
    if (this.password1 != this.password2) {
      this.notifier.notify('error', 'Пароли не совпаддают!');
    } else {
      this.userService.editPassword(this.id, password).subscribe(response => {
        if (response.status === 'Ok') {
        }
      });
    }
  }

}
