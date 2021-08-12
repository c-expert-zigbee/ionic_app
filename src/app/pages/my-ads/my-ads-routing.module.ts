import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyAdsPage } from './my-ads.page';
import { MyadsEditPage } from './myads-edit/myads-edit.page';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { Camera } from '@ionic-native/camera/ngx';

const routes: Routes = [
  {
    path: '',
    component: MyAdsPage
  },
  {
    path: 'myads-edit/:id',
    component: MyadsEditPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    PipesModule
  ],
  exports: [RouterModule],
  declarations: [MyAdsPage, MyadsEditPage],
  providers: [Camera],
})
export class MyAdsPageRoutingModule {}
