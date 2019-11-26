import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {PhotoReportComponent} from './photo-report/photo-report.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {DefaultIntl} from '../locale/locale';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{path: '', component: PhotoReportComponent}]),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AngularMultiSelectModule
  ],
  declarations: [PhotoReportComponent],
  providers: [
    {
      provide: OwlDateTimeIntl,
      useClass: DefaultIntl
    }
  ]
})
export class PhotoReportModule {
}
