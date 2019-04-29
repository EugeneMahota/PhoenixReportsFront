import {Component, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupAttrService} from '../group-attr.service';

@Component({
  selector: 'app-edit-group-attr',
  templateUrl: './edit-group-attr.component.html',
  styleUrls: ['./edit-group-attr.component.css']
})
export class EditGroupAttrComponent implements OnInit, OnChanges {

  id: number;

  name: string;

  listUser: any[] = [];
  listAttr: any[] = [];

  listUserActive: any[] = [];
  listAttrActive: any[] = [];

  settingsAttr = {
    filterUnSelectAllText: 'Выбрать все найденные',
    text: 'Аттракционы не выбраны',
    selectAllText: 'Выбрать всех аттракционы',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    enableSearchFilter: true,
    searchPlaceholderText: ' Поиск',
    badgeShowLimit: 3,
    filterSelectAllText: 'Выбрать все',
    noDataLabel: 'Список пуст'
  };

  settingsUser = {
    filterUnSelectAllText: 'Выбрать все найденные',
    text: 'Пользователи не выбраны',
    selectAllText: 'Выбрать всех пользователей',
    unSelectAllText: 'Отменить',
    classes: 'myclass custom-class',
    enableSearchFilter: true,
    searchPlaceholderText: ' Поиск',
    badgeShowLimit: 3,
    filterSelectAllText: 'Выбрать все',
    noDataLabel: 'Список пуст'
  };

  itemGroupRepl: any;

  constructor(private router: Router, private route: ActivatedRoute, private groupService: GroupAttrService) {
  }

  ngOnChanges() {
    this.getGroup();
    this.getActive();
  }

  ngOnInit() {
    this.itemGroupRepl = this.groupService.getGroupRepl();

    this.id = +this.route.snapshot.paramMap.get('id');

    this.name = this.groupService.getGroupName();

    this.getGroup();
    this.getActive();
  }


  getGroup() {
    this.groupService.getGroup(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        for (let i = 0; response.data.attrs.length > i; i++) {
          this.listAttrActive.push({
            id: response.data.attrs[i].attr_id,
            itemName: response.data.attrs[i].rep_name + ' (' + response.data.attrs[i].name + ')'
          });
        }
        for (let i = 0; response.data.users.length > i; i++) {
          this.listUserActive.push({
            id: response.data.users[i].user_id,
            itemName: response.data.users[i].name
          });
        }
      }
    });
  }

  getActive() {
    this.groupService.getListUser().subscribe(response => {
      if (response.status === 'Ok') {
        for (let i = 0; response.data.length > i; i++) {
          this.listUser.push(
            {
              id: response.data[i].user_id,
              itemName: response.data[i].name
            });
        }
      }
    });

    this.groupService.getListAttr(this.id).subscribe(response => {
      if (response.status === 'Ok') {
        for (let i = 0; response.data.length > i; i++) {
          this.listAttr.push(
            {
              id: response.data[i].attr_id,
              itemName: response.data[i].rep_name + ' (' + response.data[i].name + ')'
            });
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
