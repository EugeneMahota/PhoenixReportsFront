import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnalyticComponent} from './analytic.component';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {ChartsModule} from 'ng2-charts';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {PeopleComponent} from './people/people.component';
import {KassirAnalyticComponent} from './kassir-analytic/kassir-analytic.component';
import {DefaultIntl} from '../../locale/locale';
import {DynamicForKassaComponent} from './dynamic-for-kassa/dynamic-for-kassa.component';
import {DynamicForAttrComponent} from './dynamic-for-attr/dynamic-for-attr.component';
import {DynamicForAttrGroupComponent} from './dynamic-for-attr-group/dynamic-for-attr-group.component';

const routes: Routes = [
  {
    path: '', component: AnalyticComponent, children: [
      {path: '', redirectTo: 'people', pathMatch: 'full'},
      {path: 'people', component: PeopleComponent},
      {path: 'kassir', component: KassirAnalyticComponent},
      {path: 'dynamic-for-kassa', component: DynamicForKassaComponent},
      {path: 'dynamic-for-attr', component: DynamicForAttrComponent},
      {path: 'dynamic-for-attr-group', component: DynamicForAttrGroupComponent}
    ]
  }
];

@NgModule({
  imports: [
    ChartsModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    AngularMultiSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  declarations: [
    AnalyticComponent,
    PeopleComponent,
    KassirAnalyticComponent,
    DynamicForKassaComponent,
    DynamicForAttrComponent,
    DynamicForAttrGroupComponent
  ],
  providers: [
    {
      provide: OwlDateTimeIntl,
      useClass: DefaultIntl
    }
  ]
})
export class AnalyticModule {
}
