import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-directory-listing',
  templateUrl: './directory-listing.component.html',
  styleUrls: ['./directory-listing.component.scss']
})
export class DirectoryListingComponent implements OnInit {
  pageTitle: string = '';
  serverError: boolean = false;
  firstEntry: boolean = true;
  message: string;
  showFilter: boolean = false;
  items: any[];
  regions: any[];
  regionId: String;
  categories: any[];
  categoryId: String;
  form: FormGroup;
  searchForm: FormGroup;
  keyword: string;

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private categoryService: CategoryService,
    private appService: AppService
  ) {
    console.log(this.route.snapshot.params);
    this.pageTitle = this.route.snapshot.params.directoryName;
  }

  async ngOnInit() {
    if (this.pageTitle) {
      this.titleService.setTitle(this.pageTitle);
    } else {
      this.titleService.setTitle('expatriates.com');
    }

    await this.getAllRegions();
    await this.getCategories();

    /**
     * Find the current region ID
     * Find the current category ID
     */
    this.findRegionId();
    this.findCategoryId();

    this.form = this.fb.group({
      regdir: [this.route.snapshot.params.region != 'all' ? this.route.snapshot.params.region : ''],
      catdir: [this.route.snapshot.params.directory],
      region_id: [this.regionId],
      category_id: [this.categoryId],
      limit: [100],
      offset: [0]
    });
    this.keyword = this.route.snapshot.params.keyword;
    if (this.keyword) {
      this.showFilter = true;
      this.searchForm = this.fb.group({
        q: [this.keyword]
      });
      await this.submit(this.searchForm);
    } else {
      await this.getItems(this.route.snapshot.params);
    }
  }

  async getItems(query) {
    await this.categoryService.getListing(query).then(res => {
      this.serverError = false;
      try {
        if (res && res.hasOwnProperty('data') && res !== 'error') {
          this.items = res.data.list;
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

  async getAllRegions() {
    await this.categoryService.getAllRegionlist().then(res => {
      this.serverError = false;
      try {
        if (res && res.hasOwnProperty('data') && res !== 'error') {
          this.regions = res.data.regions;
        } else {
          this.serverError = true;
        }
      } catch (e) {
        if (res.hasOwnProperty('message')) {
          this.serverError = true;
        }
        this.appService.showLongCenterMsg('Check your internet connection.');
      }
    });
  }

  async getCategories() {
    await this.categoryService.getAllCategories().then(res => {
      this.serverError = false;
      try {
        if (res && res.hasOwnProperty('data') && res !== 'error') {
          this.categories = res.data.categories;
        } else {
          this.serverError = true;
        }
      } catch (e) {
        if (res.hasOwnProperty('message')) {
          this.serverError = true;
        }
        this.appService.showLongCenterMsg('Check your internet connection.');
      }
    });
  }

  async openFilter(ev?) {
    if (ev === false) {
      this.keyword = '';
      this.searchForm = this.fb.group({
        q: [this.keyword]
      });
      await this.submit(this.searchForm);
    }
    this.showFilter = !this.showFilter;
  }

  async submit(form: FormGroup) {
    let values = form.value;
    let search = { ...this.form.value, ...values };
    Object.keys(search).forEach(key => (search[key] == null || !search[key]) && delete search[key]);

    search = Object.entries(search)
      .map(([key, value]) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(`${value}`)}`;
      })
      .join('&');

    await this.search(search);
  }

  async search(query) {
    this.items = [];
    await this.categoryService.getListingBySearch(query).then(res => {
      this.serverError = false;
      try {
        if (res && res.hasOwnProperty('data') && res !== 'error') {
          console.log(res, 'BY SEARCH');
          this.items = res.data.searchads;
        } else {
          this.serverError = true;
        }
      } catch (e) {
        if (res.hasOwnProperty('message')) {
          this.serverError = true;
        }
        this.appService.showLongCenterMsg('Check your internet connection.');
      }
    });
  }

  private findRegionId() {
    delete this.regions['continents'];
    Object.keys(this.regions).forEach(elem => {
      this.regions[elem].forEach(item => {
        if (item.length < 1) return;
        if (item.region_code === this.route.snapshot.params.region) this.regionId = item.region_id;
      });
    });
  }

  private findCategoryId() {
    this.categories.forEach(cat => {
      if (cat.directory === this.route.snapshot.params.directory) this.categoryId = cat.category_id;
      else
        cat.subcategories.forEach(subCat => {
          if (subCat.directory === this.route.snapshot.params.directory) this.categoryId = subCat.category_id;
        });
    });
  }

  back() {
    this.navCtrl.back();
  }
}
