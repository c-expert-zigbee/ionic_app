import { Injectable } from '@angular/core';
import { PostAd } from '../models/postAd';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  postAd: PostAd;
  href: string;
  errorObject: any;

  constructor() {
    this.postAd = new PostAd();
  }
}
