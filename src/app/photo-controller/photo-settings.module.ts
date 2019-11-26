import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {PhotoSettingsComponent} from './photo-settings/photo-settings.component';
import {EventsCameraComponent} from './photo-settings/events-camera/events-camera.component';
import {KassaCameraComponent} from './photo-settings/kassa-camera/kassa-camera.component';
import {AttrCameraComponent} from './photo-settings/attr-camera/attr-camera.component';
import {FormsModule} from '@angular/forms';
import {OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {DefaultIntl} from '../locale/locale';

const routes = [
  {
    path: '', component: PhotoSettingsComponent, children: [
      {path: '', redirectTo: 'event', pathMatch: 'full'},
      {path: 'event', component: EventsCameraComponent},
      {path: 'kassa', component: KassaCameraComponent},
      {path: 'attr', component: AttrCameraComponent}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  declarations: [PhotoSettingsComponent, EventsCameraComponent, KassaCameraComponent, AttrCameraComponent],
  providers: [
    {
      provide: OwlDateTimeIntl,
      useClass: DefaultIntl
    }
  ]
})
export class PhotoSettingsModule {
}
