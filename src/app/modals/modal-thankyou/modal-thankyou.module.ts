import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalThankyouPageRoutingModule } from './modal-thankyou-routing.module';

import { ModalThankyouPage } from './modal-thankyou.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalThankyouPageRoutingModule
  ],
  declarations: [ModalThankyouPage]
})
export class ModalThankyouPageModule { }
