import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-auth-header',
  templateUrl: './auth-header.component.html',
  styleUrls: ['./auth-header.component.scss']
})
export class AuthHeaderComponent implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  close() {
    this.navCtrl.navigateBack('/');
  }
}
