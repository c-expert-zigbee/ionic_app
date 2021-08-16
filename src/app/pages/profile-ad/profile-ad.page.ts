import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { environment } from 'src/environments/environment';
import { ProfileAdService } from 'src/app/services/profile-ad.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-profile-ad',
  templateUrl: './profile-ad.page.html',
  styleUrls: ['./profile-ad.page.scss']
})
export class ProfileAdPage implements OnInit {
  subjectId: string;
  subject: any;
  images = [];
  contact_number: any;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private iab: InAppBrowser,
    private socialSharing: SocialSharing,
    private _profileAd: ProfileAdService,
    private appService: AppService
  ) {}

  async ngOnInit() {
    this.subjectId = this.route.snapshot.params.id;
    await this.getItem();

    if (this.subject.data.posting.picture1 > 0) {
      this.images.push(1);
    }
    if (this.subject.data.posting.picture2) {
      this.images.push(2);
    }
    if (this.subject.data.posting.picture3) {
      this.images.push(3);
    }
    if (this.subject.data.posting.picture4) {
      this.images.push(4);
    }
    if (this.subject.data.posting.picture5) {
      this.images.push(5);
    }
    if (this.subject.data.posting.picture6) {
      this.images.push(6);
    }
    if (this.subject.data.posting.picture7) {
      this.images.push(7);
    }
    if (this.subject.data.posting.picture8) {
      this.images.push(8);
    }
    console.log('pictures in array', this.images);
  }

  async getItem() {
    this.subject = await this._profileAd.profileAd(this.subjectId);
    this.contact_number = this.subject?.data?.posting?.contact_number;
    console.log(this.subjectId, this.subject);
  }

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  openPost(posting_id) {
    const url = `${environment.address}/cls/${posting_id}.html`;
    if (this.appService.checkOnline()) {
      this.iab.create(url, `_blank`);
    }
  }

  share() {
    const posting = this.subject.data.posting || {};
    const subject = 'Re: ' + posting.display_title;
    const description = posting.description.replace(/<\/?[^>]+(>|$)/g, '');
    const message = posting.display_title + '  ' + description.substring(0, 100) + ' ...';
    const url = `${environment.address}/cls/${posting.posting_id}.html`;

    const options = {
      message,
      subject,
      files: null,
      url,
      chooserTitle: 'Pick an app'
    };
    this.socialSharing
      .shareWithOptions(options)
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.error(error);
      });
  }

  back() {
    this.navCtrl.back();
  }
}
