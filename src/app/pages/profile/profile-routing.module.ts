import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { ProfileEditPage } from './profile-edit/profile-edit.page';

import { ComponentModule } from 'src/app/components/component.module';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
  {
    path: 'profile-edit',
    component: ProfileEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentModule
  ],
  exports: [RouterModule],
  declarations: [ProfilePage, ProfileEditPage]
})
export class ProfilePageRoutingModule {}
