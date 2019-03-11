import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupAttrService} from '../group-attr.service';

@Component({
  selector: 'app-edit-group-attr',
  templateUrl: './edit-group-attr.component.html',
  styleUrls: ['./edit-group-attr.component.css']
})
export class EditGroupAttrComponent implements OnInit {

  id: number;

  name: string;

  listUser: any[] = [];
  listAttr: any[] = [];

  listUserActive: any[] = [];
  listAttrActive: any[] = [];

  settingsAttr = {
    text: 'Аттракционы не выбраны',
    selectAllText: 'Выбрать все аттракционы',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    enableSearchFilter: true,
    searchPlaceholderText: ' Поиск',
    badgeShowLimit: 3,
    filterUnSelectAllText: 'Выбрать все',
    filterSelectAllText: 'Выбрать все',
    noDataLabel: 'Список пуст'
  };

  settingsUser = {
    text: 'Пользователи не выбраны',
    selectAllText: 'Выбрать всех пользователей',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    enableSearchFilter: true,
    searchPlaceholderText: ' Поиск',
    badgeShowLimit: 3,
    filterUnSelectAllText: 'Выбрать все',
    filterSelectAllText: 'Выбрать все',
    noDataLabel: 'Список пуст'
  };

  itemGroupRepl: any;
  constructor(private router: Router, private route: ActivatedRoute, private groupService: GroupAttrService) {
  }

  ngOnInit() {
    this.itemGroupRepl = this.groupService.getGroupRepl();

    this.id = +this.route.snapshot.paramMap.get('id');

    this.name = this.groupService.getGroupName();

    this.groupService.getGroup(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        for (let i = 0; response.data.attrs.length > i; i++) {
          this.listAttrActive.push({id: response.data.attrs[i].attr_id, itemName: response.data.attrs[i].rep_name});
        }
        for (let i = 0; response.data.users.length > i; i++) {
          this.listUserActive.push({id: response.data.users[i].user_id, itemName: response.data.users[i].name});
        }
      }
    });

    this.groupService.getListUser().subscribe(response => {
      if (response.status === 'Ok') {
        for (let i = 0; response.data.length > i; i++) {
          this.listUser.push({id: response.data[i].user_id, itemName: response.data[i].name});
        }
      }
    });

    this.groupService.getListAttr(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        for (let i = 0; response.data.length > i; i++) {
          this.listAttr.push({id: response.data[i].attr_id, itemName: response.data[i].rep_name});
        }
      }
    });
  }

  editGroup(Group) {
    this.groupService.editGroup(Group).subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard', 'list-attr-group']);
      }
    });
  }

}
