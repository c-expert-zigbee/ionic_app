import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss']
})
export class ListCardComponent implements OnInit {
  @Input() subject: any;

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.subject.picture1 === '1') {
      this.subject.profile_image = `${environment.address}/img/${this.subject.posting_id}.1.jpg`;
    } else {
      this.subject.profile_image = '';
    }
  }

  openProfile(item) {
    this.router.navigate(['/profile-ad', item.posting_id]);
  }
}
