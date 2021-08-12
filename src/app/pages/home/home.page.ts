import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

// Services
import { AppService } from '../../services/app.service';
import { StorageService } from '../../services/storage.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  pageTitle: string = '';
  keyword: string = '';
  highlightRegionList: any[];
  continents: any[];
  serverError: boolean = false;
  firstEntry: boolean = true;
  message: string;
  constructor(
    private titleService: Title,
    private router: Router,
    private navCtrl: NavController,
    private platform: Platform,
    private appService: AppService,
    private storage: StorageService,
    private categoryService: CategoryService
  ) {
    this.platform.ready().then(ready => {
      setTimeout(() => {
        this.getHighlightRegions();
        this.getRegionsList();
      }, 1000);
    });
  }

  ngOnInit() {
    if (this.pageTitle) {
      this.titleService.setTitle(this.pageTitle);
    } else {
      this.titleService.setTitle('expatriates.com');
    }
  }

  async getHighlightRegions() {
    console.log('getting regions');
    await this.categoryService.getRegionHighlightList().then(res => {
      this.serverError = false;
      try {
        this.firstEntry = false;
        if (res && res.hasOwnProperty('data') && res !== 'error') {
          this.highlightRegionList = res.data.region;
          this.storage.set('highlightRegions', JSON.stringify(this.highlightRegionList));
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
    });
  }

  openRegion(region: any) {
    this.appService.storeLastAppURL(['home/region', region.region_code, region.name]);
    this.router.navigate(['home/region', region.region_code, region.name]);
  }

  async getRegionsList() {
    await this.categoryService.getAllRegionlist().then(res => {
      this.serverError = false;
      try {
        if (res && res.hasOwnProperty('data') && res !== 'error') {
          this.continents = res.data.regions.continents;
          this.storage.set('allRegions', JSON.stringify(this.continents));
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
    });
  }

  showCountries(continentName) {
    this.continents.forEach(item =>
      item.name === continentName && (!item.show || item.show == false) ? (item.show = true) : (item.show = false)
    );
  }

  openCountry(continentId, country) {
    this.appService.storeLastAppURL(['home/region', continentId, country.region_code, country.name]);
    this.router.navigate(['home/region', continentId, country.region_code, country.name]);
  }

  goPostAd() {
    this.storage.set('goToPostAnAd', true);
    this.navCtrl.navigateForward('/post-ad');
  }

  search() {
    this.appService.storeLastAppURL(['home/directory', 'all', 'All', this.keyword]);
    this.router.navigate(['home/directory', 'all', 'All', this.keyword]);
  }
}
