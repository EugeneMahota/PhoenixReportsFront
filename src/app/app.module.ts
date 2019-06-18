import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginFormComponent} from './auth-controller/login-form/login-form.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './auth-controller/guard/auth.guard';
import {AuthService} from './auth-controller/guard/auth.service';
import {FormsModule} from '@angular/forms';
import {HomeComponent} from './home-controller/home/home.component';
import {RolesGuard} from './auth-controller/guard/roles.guard';
import {ErrorComponent} from './auth-controller/error/error.component';
import {CookieService} from 'ngx-cookie-service';
import {HttpClientModule} from '@angular/common/http';
import {RolesDirective} from './auth-controller/guard/roles.directive';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {NgxMaskModule} from 'ngx-mask';
import {OrderModule} from 'ngx-order-pipe';
import {ChartsModule} from 'ng2-charts';
import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {ProfileComponent} from './profile/profile.component';
import {ListUserComponent} from './users-controller/list-user/list-user.component';
import {AddUserComponent} from './users-controller/add-user/add-user.component';
import {EditUserComponent} from './users-controller/edit-user/edit-user.component';
import {RepKassaComponent} from './kassa-report-controller/rep-kassa/rep-kassa.component';
import {RepPassComponent} from './pass-report-controller/rep-pass/rep-pass.component';
import {KassaDetalizationComponent} from './kassa-report-controller/kassa-detalization/kassa-detalization.component';
import {PassDetalizationComponent} from './pass-report-controller/pass-detalization/pass-detalization.component';
import {RepCardComponent} from './card-report-controller/rep-card/rep-card.component';
import {ListKassirComponent} from './kassir-controller/list-kassir/list-kassir.component';
import {EditKassirComponent} from './kassir-controller/edit-kassir/edit-kassir.component';
import {AddKassirComponent} from './kassir-controller/add-kassir/add-kassir.component';
import {ListKassaComponent} from './kassa-controller/list-kassa/list-kassa.component';
import {AddKassaComponent} from './kassa-controller/add-kassa/add-kassa.component';
import {EditKassaComponent} from './kassa-controller/edit-kassa/edit-kassa.component';
import {ListGraphicComponent} from './graphic-controller/list-graphic/list-graphic.component';
import {EditGraphicComponent} from './graphic-controller/edit-graphic/edit-graphic.component';
import {AddGraphicComponent} from './graphic-controller/add-graphic/add-graphic.component';
import {LoadingComponent} from './loading/loading/loading.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {LoadingInterceptorService} from './loading/loading-interceptor.service';
import {LoadingService} from './loading/loading.service';
import {ListCardComponent} from './card-controller/list-card/list-card.component';
import {EditCardComponent} from './card-controller/edit-card/edit-card.component';
import {AddCardComponent} from './card-controller/add-card/add-card.component';
import {ListSaleComponent} from './card-controller/Sale/list-sale/list-sale.component';
import {EditSaleComponent} from './card-controller/Sale/edit-sale/edit-sale.component';
import {AddSaleComponent} from './card-controller/Sale/add-sale/add-sale.component';
import {AddBonusComponent} from './card-controller/Bonus/add-bonus/add-bonus.component';
import {EditBonusComponent} from './card-controller/Bonus/edit-bonus/edit-bonus.component';
import {ListBonusComponent} from './card-controller/Bonus/list-bonus/list-bonus.component';
import {ListHubComponent} from './hub-controller/list-hub/list-hub.component';
import {EditHubComponent} from './hub-controller/edit-hub/edit-hub.component';
import {AddHubComponent} from './hub-controller/add-hub/add-hub.component';
import {ListSchComponent} from './sch-controller/list-sch/list-sch.component';
import {EditSchComponent} from './sch-controller/edit-sch/edit-sch.component';
import {AddSchComponent} from './sch-controller/add-sch/add-sch.component';
import {ListAttrComponent} from './attr-controller/list-attr/list-attr.component';
import {AddAttrComponent} from './attr-controller/add-attr/add-attr.component';
import {EditAttrComponent} from './attr-controller/edit-attr/edit-attr.component';
import { ListPriceComponent } from './price-controller/list-price/list-price.component';
import { EditPriceComponent } from './price-controller/edit-price/edit-price.component';
import { AddPriceComponent } from './price-controller/add-price/add-price.component';
import { ListGroupAttrComponent } from './group-attr-controller/list-group-attr/list-group-attr.component';
import { EditGroupAttrComponent } from './group-attr-controller/edit-group-attr/edit-group-attr.component';
import { AddGroupAttrComponent } from './group-attr-controller/add-group-attr/add-group-attr.component';
import {SearchPipe} from './dashboard/SearchPipe';
import { SupportComponent } from './support/support.component';
import {OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DefaultIntl} from './locale/locale';
import { SettingsReportComponent } from './settings-controller/settings-report/settings-report.component';
import { SettingsPassComponent } from './settings-controller/settings-pass/settings-pass.component';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 12,
      gap: 10
    }
  },
  behaviour: {
    autoHide: 4000,
    onClick: false,
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 1
  }
};

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [RolesGuard],
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomeComponent, data: {
          title: 'home',
          roles: ['users', 'graphics', 'devices', 'cards', 'attrs', 'rptKassa', 'repAttrs', 'aclKassa', 'rptCard', 'rptCardEdit, groups', 'reset']
        }
      },
      {path: 'profile', component: ProfileComponent, data: {
          title: 'profile',
          roles: ['users', 'graphics', 'devices', 'cards', 'attrs', 'rptKassa', 'repAttrs', 'aclKassa', 'rptCard', 'rptCardEdit, groups', 'reset']
        }
      },

      {path: 'list-user', component: ListUserComponent, data: {title: 'user', roles: ['users']}},
      {path: 'list-user/add', component: AddUserComponent, data: {title: 'user', roles: ['users']}},
      {path: 'list-user/:id', component: EditUserComponent, data: {title: 'user', roles: ['users']}},

      {path: 'list-kassir', component: ListKassirComponent, data: {title: 'kassir', roles: ['kassirs']}},
      {path: 'list-kassir/add', component: AddKassirComponent, data: {title: 'kassir', roles: ['kassirs']}},
      {path: 'list-kassir/:id', component: EditKassirComponent, data: {title: 'kassir', roles: ['kassirs']}},

      {path: 'list-graphic', component: ListGraphicComponent, data: {title: 'graphic', roles: ['graphics']}},
      {path: 'list-graphic/add', component: AddGraphicComponent, data: {title: 'graphic', roles: ['graphics']}},
      {path: 'list-graphic/:id', component: EditGraphicComponent, data: {title: 'graphic', roles: ['graphics']}},

      {path: 'list-kassa', component: ListKassaComponent, data: {title: 'kassa', roles: ['aclKassa']}},
      {path: 'list-kassa/add', component: AddKassaComponent, data: {title: 'kassa', roles: ['aclKassa']}},
      {path: 'list-kassa/:id', component: EditKassaComponent, data: {title: 'kassa', roles: ['aclKassa']}},


      {path: 'list-card', component: ListCardComponent, data: {title: 'card', roles: ['cards']}},
      {path: 'list-card/add', component: AddCardComponent, data: {title: 'card', roles: ['cards']}},
      {path: 'list-card/:id', component: EditCardComponent, data: {title: 'card', roles: ['cards']}},


      {path: 'list-card/:id/list-bonus', component: ListBonusComponent, data: {title: 'card', roles: ['cards']}},
      {path: 'list-card/:id/list-bonus/add', component: AddBonusComponent, data: {title: 'card', roles: ['cards']}},
      {path: 'list-card/:id/list-bonus/:bon_id', component: EditBonusComponent, data: {title: 'card', roles: ['cards']}},

      {path: 'list-card/:id/list-sale', component: ListSaleComponent, data: {title: 'card', roles: ['cards']}},
      {path: 'list-card/:id/list-sale/add', component: AddSaleComponent, data: {title: 'card', roles: ['cards']}},
      {path: 'list-card/:id/list-sale/:sale_id', component: EditSaleComponent, data: {title: 'card', roles: ['cards']}},

      {path: 'list-hub', component: ListHubComponent, data: {title: 'hub', roles: ['hubs']}},
      {path: 'list-hub/add', component: AddHubComponent, data: {title: 'hub', roles: ['hubs']}},
      {path: 'list-hub/:id', component: EditHubComponent, data: {title: 'hub', roles: ['hubs']}},

      {path: 'list-hub/:id/list-sch', component: ListSchComponent, data: {title: 'sch', roles: ['hubs']}},
      {path: 'list-hub/:id/list-sch/add', component: AddSchComponent, data: {title: 'sch', roles: ['hubs']}},
      {path: 'list-hub/:id/list-sch/:sch_id', component: EditSchComponent, data: {title: 'sch', roles: ['hubs']}},

      {path: 'list-attr', component: ListAttrComponent, data: {title: 'attr', roles: ['attrs']}},
      {path: 'list-attr/add', component: AddAttrComponent, data: {title: 'attr', roles: ['attrs']}},
      {path: 'list-attr/:id', component: EditAttrComponent, data: {title: 'attr', roles: ['attrs']}},

      {path: 'list-attr/:id/list-price', component: ListPriceComponent, data: {title: 'price', roles: ['attrs']}},
      {path: 'list-attr/:id/list-price/add', component: AddPriceComponent, data: {title: 'price', roles: ['attrs']}},
      {path: 'list-attr/:id/list-price/:price_id', component: EditPriceComponent, data: {title: 'price', roles: ['attrs']}},

      {path: 'list-attr-group', component: ListGroupAttrComponent, data: {title: 'attr-group', roles: ['groups']}},
      {path: 'list-attr-group/add', component: AddGroupAttrComponent, data: {title: 'attr-group', roles: ['groups']}},
      {path: 'list-attr-group/:id', component: EditGroupAttrComponent, data: {title: 'attr-group', roles: ['groups']}},

      {path: 'rep-kassa', component: RepKassaComponent, data: {title: 'rep-kassa', roles: ['rptKassa']}},
      {path: 'rep-kassa/:id', component: KassaDetalizationComponent, data: {title: 'rep-kassa', roles: ['rptKassa']}},

      {path: 'rep-pass', component: RepPassComponent, data: {title: 'rep-pass', roles: ['repAttrs']}},
      {path: 'rep-pass/:id', component: PassDetalizationComponent, data: {title: 'rep-pass', roles: ['repAttrs']}},

      {path: 'rep-card', component: RepCardComponent, data: {title: 'rep-card', roles: ['rptCard']}},
      {path: 'settings-rep', component: SettingsReportComponent, data: {title: 'settings-rep', roles: ['repEditor']}},
      {path: 'settings-pass', component: SettingsPassComponent, data: {title: 'settings-pass', roles: ['repEditor']}},

      {path: 'analytic', loadChildren: './analytics-controller/analytic/analytic.module#AnalyticModule',
        data: {title: 'analytic', roles: ['analitic']}},

      {path: 'rep-time', loadChildren: './time-report-controller/time-report/time-report.module#TimeReportModule',
        data: {title: 'time-report', roles: ['repTime']}},
      {path: 'rep-abonement', loadChildren: './time-report-controller/abonement-report/abonement.module#AbonementModule',
        data: {title: 'abonement-report', roles: ['repSub']}},

      {path: 'support', component: SupportComponent, data:
          {roles: ['users', 'graphics', 'devices', 'cards', 'attrs', 'rptKassa', 'repAttrs', 'aclKassa', 'rptCard', 'rptCardEdit, groups', 'reset']}},

      {path: '**', component: HomeComponent}
    ]

  },
  {path: 'auth', component: LoginFormComponent},
  {path: 'error404', component: ErrorComponent},
  {path: '', redirectTo: 'auth', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    DashboardComponent,
    HomeComponent,
    ErrorComponent,
    RolesDirective,
    ProfileComponent,
    ListUserComponent,
    AddUserComponent,
    EditUserComponent,
    RepKassaComponent,
    RepPassComponent,
    KassaDetalizationComponent,
    PassDetalizationComponent,
    RepCardComponent,
    ListKassirComponent,
    EditKassirComponent,
    AddKassirComponent,
    ListKassaComponent,
    AddKassaComponent,
    EditKassaComponent,
    ListGraphicComponent,
    EditGraphicComponent,
    AddGraphicComponent,
    LoadingComponent,
    ListCardComponent,
    EditCardComponent,
    AddCardComponent,
    ListSaleComponent,
    EditSaleComponent,
    AddSaleComponent,
    AddBonusComponent,
    EditBonusComponent,
    ListBonusComponent,
    ListHubComponent,
    EditHubComponent,
    AddHubComponent,
    ListSchComponent,
    EditSchComponent,
    AddSchComponent,
    ListAttrComponent,
    AddAttrComponent,
    EditAttrComponent,
    ListPriceComponent,
    EditPriceComponent,
    AddPriceComponent,
    ListGroupAttrComponent,
    EditGroupAttrComponent,
    AddGroupAttrComponent,
    SearchPipe,
    SupportComponent,
    SettingsReportComponent,
    SettingsPassComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    AngularMultiSelectModule,
    NgxMaskModule.forRoot(),
    OrderModule,
    ChartsModule,
    NotifierModule.withConfig(customNotifierOptions),
    BrowserAnimationsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [AuthGuard, AuthService, RolesGuard, CookieService, LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptorService,
      multi: true
    },
    {
      provide: OwlDateTimeIntl,
      useClass: DefaultIntl
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
