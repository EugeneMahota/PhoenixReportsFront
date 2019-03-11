import {Component, OnInit} from '@angular/core';
import {UserService} from '../../users-controller/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService]
})
export class HomeComponent implements OnInit {



  constructor(private router: Router) {
  }


  ngOnInit() {

  }

  Navigate(url) {
    this.router.navigate(['dashboard', url]);
  }
}
