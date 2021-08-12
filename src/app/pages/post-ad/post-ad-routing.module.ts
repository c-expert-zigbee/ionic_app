import { Camera } from '@ionic-native/camera/ngx';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PostAdPage } from './post-ad.page';
import { SubcategoryPage } from './subcategory/subcategory.page';
import { RegionPage } from './region/region.page';
import { DetailPage } from './detail/detail.page';

const routes: Routes = [
  {
    path: '',
    component: PostAdPage
  },
  {
    path: 'subcategory',
    component: SubcategoryPage
  },
  {
    path: 'region',
    component: RegionPage
  },
  {
    path: 'detail',
    component: DetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  exports: [RouterModule],
  declarations: [SubcategoryPage, RegionPage, DetailPage],
  providers: [Camera],
})
export class PostAdPageRoutingModule {}
