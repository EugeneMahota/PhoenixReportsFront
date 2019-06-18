import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AbonementReportComponent} from './abonement-report.component';
import {OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {DefaultIntl} from '../../locale/locale';
import {FormsModule} from '@angular/forms';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: AbonementReportComponent}]),
    AngularMultiSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  declarations: [AbonementReportComponent],
  providers: [
    {
      provide: OwlDateTimeIntl,
      useClass: DefaultIntl
    }
  ]
})
export class AbonementModule {
}
