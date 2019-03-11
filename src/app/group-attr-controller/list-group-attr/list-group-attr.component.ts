import {Component, OnInit} from '@angular/core';
import {GroupAttrService} from '../group-attr.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-list-group-attr',
  templateUrl: './list-group-attr.component.html',
  styleUrls: ['./list-group-attr.component.css']
})
export class ListGroupAttrComponent implements OnInit {

  listGroupRepl: any[] = [];
  itemGroupRepl: any = {id: 0, name: ''};

  listGroupAttr: any[] = [];
  itemGroupAttr: any = {group_id: 0, name: ''};

  constructor(private groupService: GroupAttrService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.groupService.getListGroup().subscribe(response => {
      if (response.status === 'Ok') {
        this.listGroupRepl = response.data;
        if (this.groupService.getGroupRepl()) {
          this.selectListGroup(this.groupService.getGroupRepl());
        } else {
          this.selectListGroup(response.data[0]);
        }
      }
    });
  }

  selectListGroup(Group) {
    let list = this.listGroupRepl.find(x => x.id === Group.id);
    if(list) {
      this.listGroupAttr = list.list;
      this.itemGroupRepl = list.name;
      this.groupService.saveGroupRepl(list);
    } else if(this.listGroupRepl.length != 0) {
      this.listGroupAttr = this.listGroupRepl[0].list;
      this.itemGroupRepl = this.listGroupRepl[0].name;
      this.groupService.saveGroupRepl(this.listGroupRepl[0]);
    } else {
      this.listGroupAttr = [];
    }
  }

  selectGroup(Group) {
    this.itemGroupAttr = Group;
  }

  deleteGroup() {
    this.groupService.deleteGroup(this.itemGroupAttr.group_id).subscribe(response => {
      if (response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

  editGroup(Group) {
    this.groupService.saveGroupName(Group.name);
    this.router.navigate([Group.group_id], {relativeTo: this.route});
  }

}
