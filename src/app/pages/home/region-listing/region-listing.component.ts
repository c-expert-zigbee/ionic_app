import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { AppService } from 'src/app/services/app.service';
import { StorageService } from 'src/app/services/storage.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-region-listing',
  templateUrl: './region-listing.component.html',
  styleUrls: ['./region-listing.component.scss']
})
export class RegionListingComponent implements OnInit {
  pageTitle: string = '';
  keyword: string = '';
  region: string = '';
  continentId: Number = 0;
  serverError: boolean = false;
  firstEntry: boolean = true;
  message: string;
  continents: any = [];
  country: any = [];
  cities: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private appService: AppService,
    private storage: StorageService,
    private categoryService: CategoryService
  ) {
    this.pageTitle = this.route.snapshot.params.regionName;
    this.region = this.route.snapshot.params.region;
    this.continentId = this.route.snapshot.params.continentId ? this.route.snapshot.params.continentId : '903';
  }

  async ngOnInit() {
    if (this.pageTitle) {
      this.titleService.setTitle(this.pageTitle);
    } else {
      this.titleService.setTitle('expatriates.com');
    }
    await this.getRegionsList(this.continentId);
  }

  async getRegionsList(continentId) {
    await this.categoryService.getAllRegionlist().then(res => {
      this.serverError = false;
      try {
        if (res && res.hasOwnProperty('data') && res !== 'error') {
          this.continents = res.data.regions.continents;
          let continent = this.continents.find(c => c.id === continentId);
          this.country = continent.countries.find(c => c.region_code === this.region);
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

  openRegion(region) {
    this.appService.storeLastAppURL(['home/region', region.region_code, region.name]);
    this.router.navigate(['home/region', region.region_code, region.name]);
  }

  search() {
    this.appService.storeLastAppURL([
      'home/directory',
      this.region,
      this.route.snapshot.params.regionName,
      'all',
      this.route.snapshot.params.regionName,
      this.keyword
    ]);

    this.router.navigate([
      'home/directory',
      this.region,
      this.route.snapshot.params.regionName,
      'all',
      this.route.snapshot.params.regionName,
      this.keyword
    ]);
  }
}
