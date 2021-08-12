import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileAdPageRoutingModule } from './profile-ad-routing.module';
import { PipesModule } from '../../pipes/pipes.module';

import { ProfileAdPage } from './profile-ad.page';
import { ProfileAdService } from 'src/app/services/profile-ad.service';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ProfileAdPageRoutingModule, PipesModule],
  declarations: [ProfileAdPage],
  providers: [ProfileAdService]
})
export class ProfileAdPageModule {}
