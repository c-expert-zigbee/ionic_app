import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.page.html',
  styleUrls: ['./terms-and-condition.page.scss']
})
export class TermsAndConditionPage implements OnInit {
  pageTitle: string = 'Terms of Use';
  constructor(private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle(this.pageTitle);
  }
}
