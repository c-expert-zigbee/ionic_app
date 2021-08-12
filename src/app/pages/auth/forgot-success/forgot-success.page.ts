import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-success',
  templateUrl: './forgot-success.page.html',
  styleUrls: ['./forgot-success.page.scss']
})
export class ForgotSuccessPage implements OnInit {
  pageTitle: string = 'Request new password';
  constructor(private titleService: Title, private navCtrl: NavController) {}

  ngOnInit() {
    this.titleService.setTitle(this.pageTitle);
  }

  goLogin() {
    this.navCtrl.navigateForward('/login');
  }
}
