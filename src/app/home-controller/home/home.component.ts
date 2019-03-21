import {Component, OnInit} from '@angular/core';
import {UserService} from '../../users-controller/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../../auth-controller/guard/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService]
})
export class HomeComponent implements OnInit {


  username: string;

  constructor(private router: Router, private authService: AuthService) {
  }


  ngOnInit() {
    this.username = this.authService.getLogin();
  }

  Navigate(url) {
    this.router.navigate(['dashboard', url]);
  }
}
