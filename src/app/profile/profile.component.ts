import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth-controller/guard/auth.service';
import {User} from './user';
import {NotifierService} from 'angular-notifier';
import {ProfileService} from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit {

  infoUser: User = {
    name: '',
    email: '',
    phone: ''
  };
  
  rolesUser: any[] = [];
  parksUser: any[] = [];

  name: string;
  email: string;
  phone: string;

  password1: string;
  password2: string;

  private notifier;
  constructor(private authService: AuthService, private profileService: ProfileService, notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.authService.secondSetUserLoggedIn().subscribe(response => {
      if (response.status === 'Ok') {
        this.infoUser = response.data.info;
        this.name = response.data.info.name;
        this.email = response.data.info.email;
        this.phone = response.data.info.phone;
        this.rolesUser = response.data.roles;
        this.parksUser = response.data.parks;
      }
    });
  }

  editProfile(dataProfile) {
    this.profileService.editProfile(dataProfile).subscribe(response => {
      if (response.status === 'Ok') {
        this.ngOnInit();
      }
    });
  }

  editPassword(dataPassword) {
    if(dataPassword.password1 === dataPassword.password2) {
      this.profileService.editPassword(dataPassword.password1).subscribe(response => {
        if (response.status === 'Ok') {
        }
      });
    } else {
      this.notifier.notify('error', 'Пароли не совпадают!');
    }
  }

}
