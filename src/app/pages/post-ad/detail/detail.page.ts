import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PopoverController } from '@ionic/angular';

// Components
import { ModalCompleteAdsComponent } from 'src/app/modals/modal-complete-ads/modal-complete-ads.component';

// Services
import { DataService } from 'src/app/services/data.service';
import { MyAdsService } from 'src/app/services/my-ads.service';
import { AppService } from 'src/app/services/app.service';
import { ValidateService } from 'src/app/services/validate.service';

//Modal
import { MyAds } from 'src/app/models/myAds';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss']
})
export class DetailPage implements OnInit {
  pageTitle: string = 'Place a free Ad';
  formDetail: FormGroup;

  pictures = [];
  imageList = [];
  ads_item: MyAds = new MyAds();

  constructor(
    public data: DataService,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private popoverController: PopoverController,
    private camera: Camera,
    private storage: Storage,
    private myAds: MyAdsService,
    private appService: AppService,
    private validate: ValidateService
  ) {
    this.formDetail = this.fb.group({
      email: ['', [Validators.email]],
      hide_email: [''],
      currency_field: [''],
      title: ['', Validators.required],
      item_price: [''],
      contact_number: [''],
      description: ['', Validators.required],
      region_id: [this.data.postAd.region_id],
      region: [`${this.data.postAd.region_id}-${this.data.postAd.region}`],
      new_region: [],
      category_id: [this.data.postAd.category_id],
      category_title: [this.data.postAd.category_title]
    });
  }

  ngOnInit() {}

  async ionViewDidEnter() {
    let currency = await this.storage.get('currency');
    this.formDetail.get('currency_field').setValue(currency);

    let email = await this.storage.get('profile');
    email = JSON.parse(email) ? JSON.parse(email).email : null;
    this.formDetail.get('email').setValue(email);

    if (`${this.data.postAd.regionTyped}`) {
      this.formDetail.get('new_region').setValue(this.data.postAd.regionTyped);
    }
  }

  async onTakePfoto(sourceType: number, element?) {
    if (this.pictures.length > 8) return;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: sourceType // gallery: 0, camera: 1
    };

    this.camera.getPicture(options).then(
      imageData => {
        let base64Image = 'data:image/jpeg;base64,' + imageData;

        let item = {
          src: base64Image,
          blob: this.appService.dataURIToBlob(base64Image)
        };

        if (element || element == 0 || element > 0) {
          this.pictures[element] = item;
        } else {
          this.pictures.push(item);
        }
      },
      err => {
        console.log('error: ', err);
      }
    );
  }

  onDeletePicture(item) {
    console.log('delete');
    const index = this.pictures.indexOf(item);
    this.pictures.splice(index, 1);
  }

  submit() {
    this.createAd(this.formDetail.value);
  }

  async createAd(data: any) {
    this.appService.showLoader();
    this.pictures.forEach((p, i) => {
      if (p.blob) {
        // data['picture' + (i + 1)] = p.blob;
      }
    });
    console.log(data);
    this.myAds.createAds(this.appService.getFormUrlEncoded(data)).subscribe(
      (res: any) => {
        this.appService.dismissLoader();
        console.log('result update: ');
        console.log(res);
        const rules = [
          {
            key: 'posting_id',
            type: 'string',
            required: true
          }
        ];
        let validate = this.validate.validateResponse(res, rules);
        if (validate.status) {
          this.presentPopover(res.data.posting_id);
        } else {
          this.appService.showLongCenterMsg(validate.message);
        }
      },
      error => {
        console.log('Error update!!! :', error);
        this.appService.dismissLoader();
      }
    );
  }

  formControlHasError(controlName: string): boolean {
    const formControl = this.formDetail.get(controlName);
    if (formControl.status === 'INVALID' && formControl.touched == true) {
      return false;
    }
    return true;
  }

  async presentPopover(id: any) {
    const popover = await this.popoverController.create({
      component: ModalCompleteAdsComponent,
      componentProps: {
        subjectId: id
      },
      cssClass: 'modal-complete-ads',
      translucent: true
    });
    return await popover.present();
  }
}
