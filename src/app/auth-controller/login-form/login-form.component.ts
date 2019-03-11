import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../guard/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  error: string;
  show: boolean = false;
  savelogin = true;

  versionApi: string = '1.0';
  versionApiResp: string;

  login: string;
  password: string;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getVersion().subscribe(response => {
      if (this.versionApi === response.data.api) {
        this.versionApiResp = response.data.api;
      } else {
        this.show = true;
      }
    });

    this.show = true;
    this.authService.secondSetUserLoggedIn().subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard']);
      } else if (response.status === 'Error') {
        this.show = false;
      }
    }, error => {
      this.show = false;
    });
  }

  Auth(Auth) {
    this.show = true;
    this.authService.setUserLoggedIn(Auth).subscribe(response => {
      if (response.status === 'Ok') {
        this.router.navigate(['dashboard']);
        this.show = false;
      } else if (response.status === 'Error') {
        this.show = false;
      }
    }, error => {
      this.show = false;
    });
  }
}
