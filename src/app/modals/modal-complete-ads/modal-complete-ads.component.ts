import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-complete-ads',
  templateUrl: './modal-complete-ads.component.html',
  styleUrls: ['./modal-complete-ads.component.scss']
})
export class ModalCompleteAdsComponent implements OnInit {
  @Input() subjectId: any;

  constructor(private popoverCtrl: PopoverController, private router: Router) {}

  ngOnInit() {
    console.log(this.subjectId);
  }

  sendToModifiedAdPage() {
    this.onDismiss();
    this.router.navigate(['/my-ads/myads-edit', this.subjectId]);
  }

  async onDismiss() {
    try {
      await this.popoverCtrl.dismiss();
    } catch (e) {
      //click more than one time popover throws error, so ignore...
    }
  }
}
