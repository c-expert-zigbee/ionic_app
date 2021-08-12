import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileAdPage } from './profile-ad.page';

const routes: Routes = [
  {
    path: ':id',
    component: ProfileAdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileAdPageRoutingModule {}
