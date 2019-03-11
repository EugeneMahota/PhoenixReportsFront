import {Component, OnInit} from '@angular/core';
import {GraphicService} from '../graphic.service';
import {Router} from '@angular/router';
import {KassirService} from '../../kassir-controller/kassir.service';

@Component({
  selector: 'app-add-graphic',
  templateUrl: './add-graphic.component.html',
  styleUrls: ['./add-graphic.component.css']
})
export class AddGraphicComponent implements OnInit {


  name: string;
  type_graphic_id: number;
  group_id: string;
  prior: string;

  listTypeGraphic: any[] = [];
  listGroup: any[] = [];
  constructor(private graphicService: GraphicService, private router: Router, private kassirService: KassirService) {
  }

  ngOnInit() {
    this.graphicService.getListTypeGraphic().subscribe(response => {
      if (response.status === 'Ok') {
        this.listTypeGraphic = response.data;
      }
    });

    this.kassirService.getGroup().subscribe(response => {
      if(response.status === 'Ok') {
        this.listGroup = response.data;
      }
    });
  }

  addGraphic(Graphic) {
    this.graphicService.addGraphic(Graphic).subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard', 'list-graphic']);
      }
    });
  }

}
