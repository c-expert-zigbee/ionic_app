import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectRegionModalPageRoutingModule } from './select-region-modal-routing.module';

import { SelectRegionModalPage } from './select-region-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectRegionModalPageRoutingModule
  ],
  declarations: [SelectRegionModalPage]
})
export class SelectRegionModalPageModule {}
