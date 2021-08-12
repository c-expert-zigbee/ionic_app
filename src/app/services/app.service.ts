import { StorageService } from 'src/app/services/storage.service';
import { Injectable } from '@angular/core';
import { Platform, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  isOnline: boolean = true;
  isOnline$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  loader: any;
  contentType: boolean = false;

  constructor(
    private platform: Platform,
    public alertCtrl: AlertController,
    private network: Network,
    private loadingCtrl: LoadingController,
    private toast: Toast,
    private storageService: StorageService
  ) {}

  init() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      this.network.onDisconnect().subscribe(() => {
        this.isOnline = false;
        this.isOnline$.next(false);
      });
      this.network.onConnect().subscribe(() => {
        this.isOnline = true;
        this.isOnline$.next(true);
      });
    } else {
      let that = this;
      window.addEventListener(
        'online',
        function (e) {
          that.isOnline = true;
          that.isOnline$.next(true);
        },
        false
      );
      window.addEventListener(
        'offline',
        function (e) {
          that.isOnline = false;
          that.isOnline$.next(false);
        },
        false
      );
    }
  }

  async showLoader(message = '') {
    if (!this.loader) {
      this.loader = await this.loadingCtrl.create({
        message: message
      });
      return await this.loader.present();
    }
  }

  async dismissLoader() {
    if (this.loader) {
      return await this.loader.dismiss().then(() => (this.loader = null));
    }
  }

  async presentLoadingWithOptions(title: string, msg: string) {
    if (title) {
      msg = `<h5>${title}</h5>${msg}`;
    }
    if (!this.loader) {
      this.loader = await this.loadingCtrl.create({
        spinner: null,
        message: msg,
        translucent: true,
        cssClass: 'dialog-loading',
        backdropDismiss: true
      });
      return await this.loader.present();
    }
  }

  checkOnline() {
    if (this.isOnline) {
      return true;
    } else {
      const message = 'You are offline, check your internet connection.';
      this.toast.showShortCenter(message).subscribe(toast => {
        console.log(toast);
      });
      return false;
    }
  }

  showLongCenterMsg(msg: string) {
    this.toast.showLongCenter(msg).subscribe(toast => {
      console.log(toast);
    });
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: 'Unknown Error',
      buttons: ['OK']
    });
    return await alert.present();
  }

  storeLastAppURL(data) {
    this.storageService.set('lastAppURL', JSON.stringify(data));
  }

  getFormUrlEncoded(toConvert: any) {
    const formBody = [];
    for (const property in toConvert) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(toConvert[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    return formBody.join('&');
  }

  dataURIToBlob(dataURI: any) {
    var binary = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: mimeString
    });
  }
}
