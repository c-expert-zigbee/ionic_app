import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentModule } from '../../components/component.module';

import { HomePage } from './home.page';
import { RegionListingComponent } from './region-listing/region-listing.component';
import { DirectoryListingComponent } from './directory-listing/directory-listing.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule, PipesModule, ComponentModule],
  declarations: [HomePage, RegionListingComponent, DirectoryListingComponent]
})
export class HomePageModule {}
