import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-thankyou',
  templateUrl: './modal-thankyou.page.html',
  styleUrls: ['./modal-thankyou.page.scss']
})
export class ModalThankyouPage implements OnInit {
  @Input() ad_title: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }
}
