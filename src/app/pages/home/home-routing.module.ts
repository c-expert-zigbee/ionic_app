import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { RegionListingComponent } from './region-listing/region-listing.component';
import { DirectoryListingComponent } from './directory-listing/directory-listing.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'region/:continentId/:region/:regionName',
    component: RegionListingComponent
  },
  {
    path: 'region/:region/:regionName',
    component: RegionListingComponent
  },
  {
    path: 'directory/:region/:regionName/:directory/:directoryName',
    component: DirectoryListingComponent
  },
  {
    path: 'directory/:region/:regionName/:directory/:directoryName/:keyword',
    component: DirectoryListingComponent
  },
  {
    path: 'directory/:region/:regionName/:keyword',
    component: DirectoryListingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
