import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { StorageService } from 'src/app/services/storage.service';
import { Profile } from 'src/app/models/profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  pageTitle: string = 'My Profile';
  profile: Profile = new Profile();

  constructor(private titleService: Title, private storage: StorageService) {}

  ngOnInit() {
    this.titleService.setTitle(this.pageTitle);
  }

  ionViewWillEnter() {
    this.storage.get('profile').then(data => {
      this.profile = JSON.parse(data);
    });
  }
}
