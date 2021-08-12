import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectRegionModalPage } from './select-region-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SelectRegionModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectRegionModalPageRoutingModule {}
