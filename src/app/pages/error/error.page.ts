import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss']
})
export class ErrorPage implements OnInit {
  pageTitle: string = 'Network Error';

  constructor(private location: Location, private title: Title, private navCtrl: NavController) {}

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
  }

  goHome() {
    this.navCtrl.navigateBack('/home');
  }

  goPrevPage() {
    this.location.back();
  }
}
