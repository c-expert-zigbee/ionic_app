import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { MyAdsPageRoutingModule } from './my-ads-routing.module';

@NgModule({
  imports: [CommonModule, IonicModule.forRoot(), MyAdsPageRoutingModule]
})
export class MyAdsPageModule {}
