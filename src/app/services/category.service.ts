import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import * as moment from 'moment';
import { AppService } from './app.service';
import { SqlService } from './sql.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient, private appService: AppService, private sqlService: SqlService) {}

  async getAllCategories(): Promise<any> {
    let queryUrl = '/classifieds/all/category';
    //const categories = await this.sqlService.getCategories(queryUrl);
    const categories = null;
    return new Promise(resolve => {
      return this.http.get(queryUrl).subscribe(res => {
        resolve(res);
      });

      if (this.appService.isOnline) {
        if (
          categories &&
          categories.rows &&
          categories.rows.length > 0 &&
          this.checkTimeDifference(categories.rows.item(0).created_on)
        ) {
          resolve(JSON.parse(categories.rows.item(0).response));
        } else {
          this.http.get(queryUrl).subscribe(res => {
            if (res['data'] && res['data'].client_no_cache == 0) {
              this.sqlService.saveCategories(queryUrl, JSON.stringify(res));
            }
            resolve(res);
          });
        }
      } else {
        if (categories && categories.rows && categories.rows.length > 0) {
          resolve(JSON.parse(categories.rows.item(0).response));
        } else {
          this.appService.checkOnline();
        }
      }
    });
  }

  async getRegionHighlightList(): Promise<any> {
    const queryUrl = '/lookup/regionhighlight';
    //const region = await this.sqlService.getHighlightedRegions(queryUrl);
    const region = null;

    return new Promise(resolve => {
      return this.http.get(queryUrl).subscribe(res => {
        resolve(res);
      });

      if (this.appService.isOnline) {
        if (
          region &&
          region.rows &&
          region.rows.length > 0 &&
          this.checkTimeDifference(region.rows.item(0).created_on)
        ) {
          resolve(JSON.parse(region.rows.item(0).response));
        } else {
          this.http.get(queryUrl).subscribe(res => {
            if (res['data'] && res['data'].client_no_cache == 0) {
              this.sqlService.saveRegion(queryUrl, JSON.stringify(res));
            }
            resolve(res);
          });
        }
      } else {
        if (region && region.rows && region.rows.length > 0) {
          resolve(JSON.parse(region.rows.item(0).response));
        } else {
          this.appService.checkOnline();
        }
      }
    });
  }

  async getAllRegionlist(): Promise<any> {
    const queryUrl = '/lookup/regionlist';
    //const region = await this.sqlService.getRegion(queryUrl);
    const region = null;
    return new Promise(resolve => {
      return this.http.get(queryUrl).subscribe(res => {
        resolve(res);
      });

      if (this.appService.isOnline) {
        if (
          region &&
          region.rows &&
          region.rows.length > 0 &&
          this.checkTimeDifference(region.rows.item(0).created_on)
        ) {
          resolve(JSON.parse(region.rows.item(0).response));
        } else {
          this.http.get(queryUrl).subscribe(res => {
            if (res['data'] && res['data'].client_no_cache == 0) {
              this.sqlService.saveRegion(queryUrl, JSON.stringify(res));
            }
            resolve(res);
          });
        }
      } else {
        if (region && region.rows && region.rows.length > 0) {
          resolve(JSON.parse(region.rows.item(0).response));
        } else {
          this.appService.checkOnline();
        }
      }
    });
  }

  async getListing(query: any): Promise<any> {
    const queryUrl = `/listing/${query.region}/${query.directory}`;
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

  async getListingBySearch(query): Promise<any> {
    const queryUrl = `/search`;
    return new Promise(resolve => {
      if (this.appService.isOnline) {
        this.http.post(queryUrl, query).subscribe(res => {
          resolve(res);
        });
      } else {
        this.appService.checkOnline();
      }
    });
  }

  getCountryList(): Observable<any> {
    return this.http.get('/lookup/countrylist').pipe(
      map(res => {
        return res && res['data'] ? res['data'].region.country : [];
      })
    );
  }

  private checkTimeDifference(created_on) {
    const now = moment(new Date());
    const created_date = moment(created_on);
    const duration = moment.duration(now.diff(created_date));
    return duration.asHours() > 24 ? false : true;
  }
}
