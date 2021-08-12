import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';
import { PostAd } from '../../models/postAd';
import { AppService } from '../../services/app.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { DataService } from '../../services/data.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-post-ad',
  templateUrl: './post-ad.page.html',
  styleUrls: ['./post-ad.page.scss']
})
export class PostAdPage implements OnInit {
  pageTitle: string = 'Place a free Ad';
  categories: any[];

  constructor(
    private titleService: Title,
    private navCtrl: NavController,
    private appService: AppService,
    private authService: AuthService,
    private storage: StorageService,
    private data: DataService,
    private categoryService: CategoryService
  ) {
    this.authService.authState.subscribe(auth => {
      if (!auth) {
        this.navCtrl.navigateRoot('/login');
      } else {
        this.loadData();
      }
    });
  }

  private loadData() {
    this.titleService.setTitle(this.pageTitle);
    this.data.postAd = new PostAd();
    this.appService.showLoader();
    this.categoryService.getAllCategories().then(res => {
      this.appService.dismissLoader();
      if (res.status === 200 && res.data.categories.length > 0) {
        this.categories = res.data.categories;
      }
      console.log('RESULT: ', res);
    });
  }

  ngOnInit() {}

  goNextStep(cat: any) {
    console.log('cat: ', cat);
    const parent_category_id = cat.category_id;
    const parent_category_title = cat.title;
    this.storage.set('currentSelectedCategory', JSON.stringify(cat));
    if (cat.subcategories.length > 0) {
      this.storage.set('currentSelection', 'sell');
      this.data.postAd.parent_category_title = parent_category_title;
      this.data.postAd.parent_category_id = parent_category_id;
      this.navCtrl.navigateForward('post-ad/subcategory');
    } else {
      this.data.postAd.category_title = parent_category_title;
      this.data.postAd.category_id = parent_category_id;
      this.storage.set('currentSelection', 'buy');
      this.data.href = 'post-ad';
      this.navCtrl.navigateForward('post-ad/region');
    }
  }
}
