import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostAdPageRoutingModule } from './post-ad-routing.module';
import { ComponentModule } from '../../components/component.module';

import { PostAdPage } from './post-ad.page';

@NgModule({
  imports: [CommonModule, FormsModule,ReactiveFormsModule, IonicModule, PostAdPageRoutingModule, ComponentModule],
  declarations: [PostAdPage]
})
export class PostAdPageModule {}
