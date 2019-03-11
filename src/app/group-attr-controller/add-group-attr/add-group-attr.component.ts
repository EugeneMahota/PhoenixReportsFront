import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupAttrService} from '../group-attr.service';
import {KassirService} from '../../kassir-controller/kassir.service';

@Component({
  selector: 'app-add-group-attr',
  templateUrl: './add-group-attr.component.html',
  styleUrls: ['./add-group-attr.component.css']
})
export class AddGroupAttrComponent implements OnInit {

  group_id: string;
  name: string;

  listGroup: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private groupService: GroupAttrService, private kassirService: KassirService) {
  }

  ngOnInit() {
    this.kassirService.getGroup().subscribe(response => {
      if (response.status === 'Ok') {
        this.listGroup = response.data;
      }
    });
  }

  addGroup(Group) {
    this.groupService.addGroup(Group).subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard', 'list-attr-group']);
      }
    });
  }

}
