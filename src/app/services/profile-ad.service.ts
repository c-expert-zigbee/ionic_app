import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// Services
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileAdService {

  constructor(private http: HttpClient, private appService: AppService) {}

  async profileAd(id): Promise<any> {
    let queryUrl = `/posting/${id}`;
    return new Promise(resolve => {
      if (this.appService.isOnline) {
        this.http.get(queryUrl).subscribe(res => {
          resolve(res);
        });
      } else {
        this.appService.checkOnline();
      }
    });
  }

}
