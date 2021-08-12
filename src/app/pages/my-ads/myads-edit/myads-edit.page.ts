import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AlertController, ModalController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { environment } from 'src/environments/environment';
import { MyAds } from 'src/app/models/myAds';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { MyAdsService } from 'src/app/services/my-ads.service';
import { ValidateService } from '../../../services/validate.service';
import { ModalModifyAdsPage } from 'src/app/modals/modal-modify-ads/modal-modify-ads.page';
import { ModalThankyouPage } from 'src/app/modals/modal-thankyou/modal-thankyou.page';

@Component({
  selector: 'app-myads-edit',
  templateUrl: './myads-edit.page.html',
  styleUrls: ['./myads-edit.page.scss']
})
export class MyadsEditPage implements OnInit {
  posting_id: string;
  pageTitle: string = 'My Ads';
  ads_item: MyAds = new MyAds();
  msg: string;
  shown_block_btn: boolean = false;
  pictures = [];
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  modalTitle: any;

  constructor(
    private router: Router,
    public activedRoute: ActivatedRoute,
    private appService: AppService,
    private adService: MyAdsService,
    private titleService: Title,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private iab: InAppBrowser,
    public modalController: ModalController,
    private validateService: ValidateService
  ) {}

  ngOnInit() {
    this.posting_id = this.activedRoute.snapshot.params['id'];
    this.titleService.setTitle(this.pageTitle);
    this.shown_block_btn = false;
    this.pictures = [];
    this.appService.showLoader();
    this.adService.getPostingDetail(this.posting_id).subscribe(
      res => {
        let item: any = res;
        this.appService.dismissLoader();
        let dt = new Date().getTime();
        if (item.status == 200) {
          this.ads_item = item.data.posting;
          let url = `${environment.address}/img/${this.posting_id}.`;
          for (let i = 1; i <= 8; i++) {
            if (this.ads_item['picture' + i] === '1') {
              let pic_url = `${url}${i}.jpg?h=250;&dt=${dt}`;
              this.pictures.push(pic_url);
            }
          }
          console.log('array this.pictures = ', this.pictures);
          if (this.ads_item.active !== '-5000') {
            this.shown_block_btn = true;
          } else {
            this.shown_block_btn = false;
          }
          this.appService.dismissLoader();
        } else {
          if (item.status == 422 && item.data.error == 'Authentication failed') {
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            this.msg =
              res.hasOwnProperty('data') && item.data.hasOwnProperty('error')
                ? item.data.error
                : 'You have no ads posted.';
          }
        }
      },
      error => {
        console.log('my ads error: ', error);
        this.appService.dismissLoader();
      }
    );
    this.appService.dismissLoader();
  }

  onBack() {
    this.router.navigateByUrl('/my-ads');
  }

  async activateAd() {
    const alert = await this.alertCtrl.create({
      header: 'Thank You!',
      message: `
      Activate: ${this.ads_item.display_title}
      
      You ad has been activated!
      `,
      buttons: [
        {
          text: 'Ok',
          handler: () => {}
        }
      ]
    });
    this.appService.showLoader();
    this.adService.setActivateAds(this.posting_id, this.ads_item.unique_id, this.ads_item.email).subscribe(
      result => {
        console.log('result', result);
        this.appService.dismissLoader();
        alert.present();
      },
      error => {
        console.log('Active error: ', error);
        this.appService.dismissLoader();
      }
    );
  }

  async onModify() {
    const modal = await this.modalController.create({
      component: ModalModifyAdsPage,
      componentProps: {
        data: this.ads_item
      }
    });
    return await modal.present();
  }

  async onRemove() {
    const alert = await this.alertCtrl.create({
      message: 'Are you sure you want to remove this Ad?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Clicked no');
          }
        },
        {
          text: 'Remove Ad',
          handler: () => {
            this.appService.showLoader();
            this.adService.deleteAds(this.posting_id, this.ads_item.unique_id, this.ads_item.email).subscribe(
              res => {
                console.log(`Delete posting_id:${this.posting_id} result: ${res}`);
                this.appService.dismissLoader();
                const rules = [
                  {
                    key: 'remove',
                    type: 'string',
                    required: true,
                    value: 'success'
                  }
                ];
                let validate = this.validateService.validateResponse(res, rules);
                if (res['status'] == 422 && res['data'].error == 'Authentication failed') {
                  this.authService.logout();
                } else if (validate.status == true) {
                  this.presentThankyouModal();
                } else {
                  const errMessage = 'Ad could not be removed';
                  this.appService.showLongCenterMsg(errMessage);
                }
              },
              error => {
                console.log('my ads error: ', error);
                this.appService.dismissLoader();
              }
            );
          }
        }
      ]
    });
    await alert.present();
  }
  async presentThankyouModal() {
    const modal = await this.modalController.create({
      component: ModalThankyouPage,
      cssClass: 'thankyou-modal',
      componentProps: {
        ad_title: this.ads_item.display_title
      }
    });
    return await modal.present();
  }

  onPremium() {
    let url = `https://www.expatriates.com/scripts/posting/premium.epl?id=${this.ads_item.unique_id}&email=${this.ads_item.email}`;
    if (this.appService.checkOnline()) {
      this.iab.create(url, `_system`);
    }
  }
}
