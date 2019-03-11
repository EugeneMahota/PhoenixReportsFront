import {Component, OnInit} from '@angular/core';
import {GraphicService} from '../graphic.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-list-graphic',
  templateUrl: './list-graphic.component.html',
  styleUrls: ['./list-graphic.component.css']
})
export class ListGraphicComponent implements OnInit {

  listGraphic: any[] = [];
  itemGraphic: any = {graphic_id: 0, name: ''};

  listGroupRepl: any[] = [];
  itemGroupRepl: any;

  groupId: number;
  date: string;

  dateNow: Date = new Date();

  constructor(private graphicService: GraphicService, private router: Router, private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.date = this.dateNow.getFullYear().toString() + '-' + ((this.dateNow.getMonth() + 1).toString().length == 2 ? (this.dateNow.getMonth() + 1).toString() : '0' + (this.dateNow.getMonth() + 1).toString()) + '-' + (this.dateNow.getDate().toString().length == 2 ? this.dateNow.getDate().toString() : '0' + this.dateNow.getDate().toString()) + ' ' + '12:00';


    this.graphicService.getListGraphic().subscribe(response => {
      if (response.status === 'Ok') {
        this.listGroupRepl = response.data;
        if (this.graphicService.getGroupRepl()) {
          this.selectGroup(this.graphicService.getGroupRepl());
        } else {
          this.selectGroup(response.data[0]);
        }
      }
    });
  }

  selectGraphic(Graphic) {
    this.itemGraphic = Graphic;
  }

  deleteGraphic() {
    this.graphicService.deleteGraphic(this.itemGraphic.graphic_id).subscribe(response => {
      if (response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

  editGraphic(Graphic) {
    this.router.navigate([Graphic.graphic_id], {relativeTo: this.route});
  }

  selectGroup(Group) {
    this.groupId = Group.id;
    let list = this.listGroupRepl.find(x => x.id === Group.id);
    if (list) {
      this.listGraphic = list.list;
      this.itemGroupRepl = list.name;
      this.graphicService.saveGroupRepl(list);
    } else if (this.listGroupRepl.length != 0) {
      this.listGraphic = this.listGroupRepl[0].list;
      this.itemGroupRepl = this.listGroupRepl[0].name;
      this.graphicService.saveGroupRepl(this.listGroupRepl[0]);
    } else {
      this.listGraphic = [];
    }
  }

  curGraphic(Data) {
    Data.date = Data.date.replace(/T/, ' ');
    console.log(Data);
  }

}
