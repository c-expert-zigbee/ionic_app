import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Profile } from 'src/app/models/profile';
import { AppService } from 'src/app/services/app.service';
import { StorageService } from 'src/app/services/storage.service';
import { MyProfileService } from 'src/app/services/my-profile.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss']
})
export class ProfileEditPage implements OnInit {
  pageTitle: string = 'Edit Profile';
  profile: Profile = new Profile();
  profileForm: FormGroup;
  profileType: string;

  constructor(
    private titleService: Title,
    private storage: StorageService,
    public formBuilder: FormBuilder,
    private appService: AppService,
    private setData: MyProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.titleService.setTitle(this.pageTitle);
    this.loadProfile();
  }

  private loadProfile() {
    this.storage.get('profile').then(data => {
      this.profile = JSON.parse(data);
      this.profileForm = this.formBuilder.group({
        first_name: new FormControl(this.profile.first_name),
        last_name: new FormControl(this.profile.last_name),
        phone: new FormControl(this.profile.phone),
        email: new FormControl(this.profile.email),
        region_name: new FormControl(this.profile.region_name),
        company_name: new FormControl(this.profile.company_name),
        language: new FormControl(this.profile.language),
        type: new FormControl(this.profile.type)
      });
    });
  }

  onSave() {
    let result = this.profileForm.value;
    this.storage.set('profile', JSON.stringify(result));

    let profileObj = {
      firstname: result.first_name,
      lastname: result.last_name,
      company: result.company_name,
      phone: result.phone || '',
      region: result.region_id + '-' + result.region_name,
      language: result.language,
      type: result.type,
      todo: 'successmodify'
    };

    this.appService.showLoader();
    this.setData.updateProfile(profileObj).subscribe(res => {
      console.log(res);
      this.appService.dismissLoader();
      if (res) {
        const msg = 'Profile successfully updated.';
        this.appService.showLongCenterMsg(msg);
        this.router.navigate(['/profile']);
      }
    });
  }
}
