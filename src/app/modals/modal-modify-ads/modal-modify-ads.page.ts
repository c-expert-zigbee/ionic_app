import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MyAds } from 'src/app/models/myAds';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { MyAdsService } from 'src/app/services/my-ads.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-modal-modify-ads',
  templateUrl: './modal-modify-ads.page.html',
  styleUrls: ['./modal-modify-ads.page.scss']
})
export class ModalModifyAdsPage implements OnInit {
  @Input() data: any;
  adsForm: FormGroup;
  ads_item: MyAds = new MyAds();
  pictures = [];
  imageList = [];

  constructor(
    public modalController: ModalController,
    public formBuilder: FormBuilder,
    private camera: Camera,
    private adService: MyAdsService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.ads_item = this.data;
    console.log('ads_item::: ', this.ads_item);
    this.adsForm = this.formBuilder.group({
      title: new FormControl(this.ads_item.title, [Validators.required]),
      description: new FormControl(this.ads_item.description, [Validators.required]),
      category_title: new FormControl(this.ads_item.category_title),
      region_name: new FormControl(this.ads_item.region_name),
      new_region: new FormControl(''),
      currency: new FormControl(this.ads_item.currency),
      item_price: new FormControl(this.ads_item.item_price),
      contact_number: new FormControl(this.ads_item.contact_number),
      hide_email: new FormControl(this.ads_item.hide_email)
    });
  }

  formControlHasError(controlName: string): boolean {
    const formControl = this.adsForm.get(controlName);
    if (formControl.status === 'INVALID') {
      return false;
    }
    return true;
  }

  private getBlob(b64Data: string, contentType: string, sliceSize: number = 100) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  async onTakePfoto(sourceType: number, element?) {
    if (this.pictures.length > 8) return;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: sourceType
    };
    // gallery
    if (sourceType === 0) {
      this.camera.getPicture(options).then(
        imageData => {
          let base64Image = 'data:image/jpeg;base64,' + imageData;

          let item = {
            src: '',
            picture: base64Image
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
    // camera
    if (sourceType === 1) {
      this.camera.getPicture(options).then(
        imageData => {
          let base64Image = 'data:image/jpeg;base64,' + imageData;

          let item = {
            src: '',
            picture: base64Image
          };

          if (element || element == 0 || element > 0) {
            this.pictures[element] = item;
          } else {
            this.pictures.push(item);
          }
        },
        err => {
          console.log('errorss: ', err);
        }
      );
    }
  }

  onDeletePicture(item) {
    const index = this.pictures.indexOf(item);
    if (index > -1) {
      this.pictures.splice(index, 1);
    }
  }

  onSave() {
    if (!this.adsForm.valid) {
      return console.log('Not Valid');
    }
    let valuesform = this.adsForm.value;
    let postingData = {
      unique_id: this.ads_item.unique_id,
      email: this.ads_item.email,
      contact_number: valuesform.contact_number,
      new_region: valuesform.new_region,
      description: valuesform.description,
      hide_email: valuesform.hide_email,
      title: valuesform.title,
      item_price: valuesform.item_price
    };

    if (this.ads_item.category_id === '8' || this.ads_item.category_id === '9') {
      let item = {
        item_price: this.ads_item.item_price
      };
      Object.assign(postingData, item);
    }

    if (this.pictures.length > 0) {
      this.pictures.map((value, index) => {
        let num = index++;
        let key = 'picture' + num;
        let item = {
          key: value
        };
        Object.assign(postingData, item);
      });
    }

    this.appService.showLoader();
    this.adService.updateAds(this.ads_item.posting_id, postingData).subscribe(
      res => {
        this.appService.dismissLoader();
        console.log('result update: ', res);
        this.modalController.dismiss(null);
      },
      error => {
        console.log('Error update!!! :', error);
        this.appService.dismissLoader();
      }
    );
  }

  onClose() {
    this.modalController.dismiss(null);
  }
}
