import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-create-success',
  templateUrl: './create-success.page.html',
  styleUrls: ['./create-success.page.scss']
})
export class CreateSuccessPage implements OnInit {
  pageTitle: string = 'Create Account';
  constructor(private titleService: Title, private navCtrl: NavController) {}

  ngOnInit() {
    this.titleService.setTitle(this.pageTitle);
  }

  goLogin() {
    this.navCtrl.navigateForward('/login');
  }
}
