import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Region } from 'src/app/models/region';

// Services
import { StorageService } from '../../services/storage.service';
import { CategoryService } from 'src/app/services/category.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-select-region-modal',
  templateUrl: './select-region-modal.page.html',
  styleUrls: ['./select-region-modal.page.scss']
})
export class SelectRegionModalPage implements OnInit {
  @Input() countryOrCity: Region;
  regionList;
  search: string;
  serverError: boolean = false;
  message: string;
  regions: any[];
  filteredData;
  regionCities: any[];
  country;

  constructor(
    private modalCtrl: ModalController,
    private storage: StorageService,
    private categoryService: CategoryService,
    private appService: AppService
  ) {
    this.regionList = [];
  }

  async ngOnInit() {
    await this.getRegionsList();
    if (this.regions) {
      const regions = this.regions['continents'];
      const countryList = regions.map(r => r['countries']);
      let countryListArray = this.sortByName(countryList);
      let items = [];
      countryListArray.map(r => {
        r.forEach(item => items.push(item));
      });
      items.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)      
      items.forEach(country => {
        country.showName = country.name;
        let country_currency = country.currency;
        this.regionList.push(country);
        if (country.cities) {
          country.cities = this.sortByName(country.cities);
          country.cities.forEach(city => {
            city.showName = '. . . ' + city.name;
            city.currency = country_currency;
            this.regionList.push(city);
            if (city.subcities && city.subcities.length > 0) {
              city.subcities = this.sortByName(city.subcities);
              city.subcities.forEach(subcity => {
                subcity.showName = '. . . . . . ' + subcity.name;
                subcity.currency = country_currency;
                this.regionList.push(subcity);
              });
            }
          });
        }
      });
    }

    this.filteredData = this.regionList;
  }

  searchTerm(ev: any) {
    this.filteredData = this.regionList.reduce((acc, a) => {
      const ch = a.cities && a.cities.filter(b => b.name.toLowerCase().indexOf(this.search.toLowerCase()) === 0);
      if (ch && ch.length) acc.push({ ...a, cities: ch });
      else if (a.name.toLowerCase().indexOf(this.search.toLowerCase()) === 0) acc.push({ ...a, cities: null });
      return acc;
    }, []);
  }

  async getRegionsList() {
    await this.categoryService.getAllRegionlist().then(res => {
      this.serverError = false;
      try {
        if (res && res.hasOwnProperty('data') && res !== 'error') {
          this.regions = this.filteredData = res.data.regions;
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

  private sortByName(regions: any) {
    regions.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
    return regions;
  }

  close() {
    this.modalCtrl.dismiss({
      region: this.countryOrCity
    });
  }
}
