import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NavController, Platform, IonInput } from '@ionic/angular';
import { createAnimation } from '@ionic/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';

import { AppService } from '../../services/app.service';
import { MyAdsService } from '../../services/my-ads.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-my-ads',
  templateUrl: './my-ads.page.html',
  styleUrls: ['./my-ads.page.scss']
})
export class MyAdsPage implements OnInit {
  @ViewChild('searchInput', { static: false }) searchInput: IonInput;
  pageTitle: string = 'My Ads';
  showMsg = false;
  showFilter = false;
  myAds = [];
  AdPageCount = 1;
  loadMore = false;
  msg: string;
  searchFilter = {
    sort: '',
    filter: '',
    q: ''
  };
  messageFlag = false;

  constructor(
    private titleService: Title,
    private router: Router,
    private navCtrl: NavController,
    private platform: Platform,
    private keyboard: Keyboard,
    private appService: AppService,
    private adService: MyAdsService,
    private authService: AuthService,
    private storage: StorageService
  ) {}

  ngOnInit() {
    this.titleService.setTitle(this.pageTitle);
    this.getMyAds();
  }

  ionViewDidEnter() {}

  private getMyAds() {
    // this.appService.showLoader();
    let url = '?page=' + this.AdPageCount;
    this.adService.myAds(url, {}).subscribe(
      res => {
        this.appService.dismissLoader();
        if (res.status == 200 && res.data.hasOwnProperty('myads') && res.data.myads[0]) {
          if (res.data.myads.length >= 50) {
            this.AdPageCount = this.AdPageCount + 1;
            this.loadMore = true;
          }
          this.myAds = this.myAds.concat(res.data.myads);
        } else {
          this.loadMore = false;
          if (res.status == 422 && res.data.error == 'Authentication failed') {
            this.authService.logout();
          } else {
            this.showMsg = true;
            this.msg =
              res.hasOwnProperty('data') && res.data.hasOwnProperty('error')
                ? res.data.error
                : 'You have no ads posted.';
          }
        }
      },
      error => {
        console.log('my ads error: ', error);
        this.appService.dismissLoader();
      }
    );
  }

  async openFilter() {
    this.showFilter = !this.showFilter;
    // let filterAnimation = createAnimation().addElement(document.querySelector('.search-filter')).duration(1500);
    // if (this.showFilter) {
    //   filterAnimation.fromTo('height', '0px', 'auto');
    // } else {
    //   filterAnimation.fromTo('height', 'auto', '0px');
    // }
    // await filterAnimation.play();
  }

  resetMyAdsFilters() {
    this.searchFilter = {
      sort: '',
      filter: '',
      q: ''
    };
    this.messageFlag = false;
    this.AdPageCount = 1;
    this.myAds = [];
    this.getMyAds();
    this.openFilter();
  }

  searchAds() {
    this.appService.showLoader();
    this.myAds = [];
    this.messageFlag = false;
    this.adService.myAds('', this.searchFilter).subscribe(
      res => {
        this.appService.dismissLoader();
        console.log(res);
        if (res.status == 200 && res.data.hasOwnProperty('myads') && res.data.myads[0]) {
          if (res.data.myads.length >= 50) {
            this.AdPageCount = this.AdPageCount + 1;
            this.loadMore = true;
          }
          this.myAds = this.myAds.concat(res.data.myads);
        } else {
          this.loadMore = false;
          if (res.status == 422 && res.data.error == 'Authentication failed') {
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            this.showMsg = false;
            this.messageFlag = true;
            this.msg =
              res.hasOwnProperty('data') && res.data.hasOwnProperty('error')
                ? res.data.error
                : 'You have no ads posted.';
          }
        }
      },
      error => {
        console.log('my ads error: ', error);
        this.appService.dismissLoader();
      }
    );
  }

  showKeyBoard() {
    this.messageFlag = false;
    this.AdPageCount = 1;
    this.searchInput.setFocus();
    if (this.platform.is('ios')) {
      this.searchInput.getInputElement().then(res => {
        res.focus();
      });
    } else {
      this.keyboard.show();
    }
  }

  goPostAd() {
    this.storage.set('goToPostAnAd', true);
    this.navCtrl.navigateForward('/post-ad');
  }

  editmyAds(posting_id: string) {
    this.router.navigateByUrl('/my-ads/myads-edit/' + posting_id);
  }
}
