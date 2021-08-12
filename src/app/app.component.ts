import { Component, OnInit, Input } from '@angular/core';
import { MenuController, Platform, NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

// Services
import { AppService } from './services/app.service';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { CategoryService } from './services/category.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  @Input() region: any;
  versionNumber: string;
  isAuth = false;
  serverError: boolean = false;
  categories: any[];
  message: string;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appVersion: AppVersion,
    private iab: InAppBrowser,
    private appService: AppService,
    private authService: AuthService,
    private storageService: StorageService,
    private categoryService: CategoryService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.appVersion.getVersionNumber().then(version => {
        this.versionNumber = version;
      });
      this.appService.init();

      this.authService.authState.subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.isAuth = true;
          this.checkProfile();
        } else {
          this.isAuth = false;
          this.navCtrl.navigateRoot('/');
        }
      });
    });
  }

  ngOnInit() {
    this.menu.enable(true, 'catMenu');
    this.getCategories();
  }

  async getCategories() {
    await this.categoryService.getAllCategories().then(res => {
      this.serverError = false;
      try {
        if (res && res.hasOwnProperty('data') && res !== 'error') {
          this.categories = res.data.categories;
          this.categories.forEach(category => {
            if (category.subcategories.length > 0) {
              var object = { ...category };
              object.title = `All ${object.title}`;
              delete object.subcategories;
              category.subcategories.unshift(object);
            }
          });
          this.storageService.set('categories', JSON.stringify(this.categories));
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
    this.categories.forEach(item =>
      item.category_id === id && (!item.show || item.show == false) ? (item.show = true) : (item.show = false)
    );
  }

  openCategory(cat) {
    this.appService.storeLastAppURL(['home/directory', 'all', 'All', cat.directory, cat.title]);
    this.router.navigate(['home/directory', 'all', 'All', cat.directory, cat.title]);
  }

  async checkProfile() {
    this.storageService.get('goToPostAnAd').then(sendToPostAnAd => {
      this.authService.getProfile().subscribe(
        res => {
          this.appService.dismissLoader();
          this.storageService.set('profile', JSON.stringify(res.data.profile));
          this.storageService.get('lastAppURL').then(data => {
            if (data) {
              this.router.navigate(JSON.parse(data));
            } else {
              if (sendToPostAnAd) {
                this.router.navigate(['/post-ad']);
                this.storageService.remove('goToPostAnAd');
              } else {
                this.router.navigate(['/my-ads']);
              }
            }
          });
        },
        error => {
          console.log('get profile error: ', error);
          this.appService.dismissLoader();
        }
      );
    });
  }

  openContact() {
    if (this.appService.checkOnline()) {
      const url = 'http://expatriates.com/html/contactus.html';
      this.iab.create(url, `_system`);
    }
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      message: 'Are you sure to logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Clicked no');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.authService.logout();
          }
        }
      ]
    });
    await alert.present();
  }
}
