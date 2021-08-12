import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavController, ModalController } from '@ionic/angular';

// Models
import { Region } from 'src/app/models/region';

// Services
import { StorageService } from '../../../services/storage.service';
import { DataService } from '../../../services/data.service';
import { CategoryService } from 'src/app/services/category.service';
import { AppService } from 'src/app/services/app.service';

import { SelectRegionModalPage } from '../../select-region-modal/select-region-modal.page';

@Component({
  selector: 'app-region',
  templateUrl: './region.page.html',
  styleUrls: ['./region.page.scss']
})
export class RegionPage implements OnInit {
  pageTitle: string = 'Place a free Ad';
  countryOrCity = new Region();
  serverError: boolean = false;
  message: string;
  regions: any;

  constructor(
    private title: Title,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private storage: StorageService,
    public data: DataService,
    private categoryService: CategoryService,
    private appService: AppService,
  ) {
  }

  async ngOnInit() {
    this.title.setTitle(this.pageTitle);
    await this.getRegionsList();
    await this.getCurrentUserRegion();
  }

  async getRegionsList() {
    await this.categoryService.getAllRegionlist().then(res => {
      this.serverError = false;
      try {
        if (res && res.hasOwnProperty('data') && res !== 'error') {
          this.regions = res.data.regions;
        } else {
          this.serverError = true;
          this.message = res.message;
        }
      } catch (e) {
        if (res.hasOwnProperty('message')) {
          this.serverError = true;
          this.message = res.message;
        }
        this.appService.showLongCenterMsg('Check your internet connection.');
      }
    })
  }

  async getCurrentUserRegion() {
    const userRegion = await this.storage.get('currentUserRegion');
    if (userRegion) {
      if (userRegion.name) {
        let regionObj = this._findRegionFromList(userRegion.name);
        if (regionObj) {
          this.countryOrCity.name = regionObj.name;
          this.countryOrCity.region_id = regionObj.region_id;
          this.storage.set('currentUserRegion', JSON.stringify(this.countryOrCity));
          const currency = regionObj.currency != undefined ? regionObj.currency : regionObj.currency_code;
          this.storage.set('currency', currency);
        }
      }
    }
  }

  private _findRegionFromList(regionName: string) {
    const regions = [].concat.apply(this.regions.countries, [this.regions.cities, this.regions.subcities]);
    return regions.find(r => r.name == regionName);
  }

  async selectRegion() {
    const modal = await this.modalCtrl.create({
      component: SelectRegionModalPage,
      componentProps: {
        countryOrCity: this.countryOrCity
      }
    });
    modal.onDidDismiss().then(async res => {
      if (res && res.data) {
        await this.storage.set('currentUserRegion', res.data.region);
        await this.getCurrentUserRegion();
      }
    });
    return await modal.present();
  }

  goNextStep() {
    this.data.postAd.region = this.countryOrCity.name;
    this.data.postAd.region_id = this.countryOrCity.region_id;
    this.navCtrl.navigateForward('post-ad/detail');
  }

}
