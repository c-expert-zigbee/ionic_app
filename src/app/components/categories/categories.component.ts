import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { CategoryService } from '../../services/category.service';
import { AppService } from 'src/app/services/app.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-main-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {

  @Input() region: any

  categories: any[];
  serverError: boolean = false;

  constructor(
    private router: Router,
    private appService: AppService,
    private categoryService: CategoryService,
    private storage: StorageService,
  ) { }

  ngOnInit() {
    this.getCategories();
  }

  async getCategories() {
    await this.categoryService.getAllCategories().then(res => {
      this.serverError = false;
      try {
        if (res && res.hasOwnProperty('data') && res !== 'error') {
          this.categories = res.data.categories;
          this.categories.forEach((category) => {
            var object = { ...category }
            object.title = `All ${object.title}`
            delete object.subcategories;
            category.subcategories.unshift(object)
          });
          this.storage.set('categories', JSON.stringify(this.categories));
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

  toogleCategory(id) {
    this.categories.forEach(item => (item.category_id === id && ((!item.show) || (item.show == false))) ? item.show = true : item.show = false)
  }

  openCategory(cat) {
    console.log(cat, this.region);
    this.appService.storeLastAppURL(['home/directory', this.region.region, this.region.regionName, cat.directory, cat.title]);
    this.router.navigate(['home/directory', this.region.region, this.region.regionName, cat.directory, cat.title])
  }

}
