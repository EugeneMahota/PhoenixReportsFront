import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {PhotoViewComponent} from './photo-view/photo-view.component';
import {AddCameraComponent} from './photo-view/add-camera/add-camera.component';
import {EditCameraComponent} from './photo-view/edit-camera/edit-camera.component';
import {FormsModule} from '@angular/forms';

const routes = [
  {path: '', component: PhotoViewComponent},
  {path: 'add', component: AddCameraComponent},
  {path: ':id', component: EditCameraComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  declarations: [PhotoViewComponent, AddCameraComponent, EditCameraComponent]
})
export class PhotoViewModule {
}
