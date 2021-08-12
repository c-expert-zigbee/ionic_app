import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';
import { StorageService } from '../../../services/storage.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.page.html',
  styleUrls: ['./subcategory.page.scss']
})
export class SubcategoryPage implements OnInit {
  pageTitle: string = 'Place a free Ad';
  selCategories: any;

  constructor(
    private title: Title,
    private navCtrl: NavController,
    private storage: StorageService,
    private data: DataService
  ) {}

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this.storage.get('currentSelectedCategory').then(res => {
      this.selCategories = JSON.parse(res);
    });
  }

  goNextStep(subCat: any) {
    this.storage.set('currentSelectedSubCategory', JSON.stringify(subCat));
    this.data.postAd.category_title = subCat.title;
    this.data.postAd.category_id = subCat.category_id;
    this.data.href = 'post-ad/subcategory';
    this.navCtrl.navigateForward('post-ad/region');
  }
}
