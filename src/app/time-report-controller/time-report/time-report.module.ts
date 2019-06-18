import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TimeReportComponent} from './time-report.component';
import {OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {DefaultIntl} from '../../locale/locale';
import {FormsModule} from '@angular/forms';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {TimeDetalizationComponent} from './time-detalization/time-detalization.component';

const routes = [
  {path: '', component: TimeReportComponent},
  {path: ':id', component: TimeDetalizationComponent}
  ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AngularMultiSelectModule,
    RouterModule.forChild(routes),
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  declarations: [TimeReportComponent, TimeDetalizationComponent],
  providers: [
    {
      provide: OwlDateTimeIntl,
      useClass: DefaultIntl
    }
  ]
})
export class TimeReportModule {
}
