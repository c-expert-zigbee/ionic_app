import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class MyAdsService {
  constructor(private http: HttpClient, private appService: AppService) {}

  myAds(url: string = '', query: any = {}): Observable<any> {
    let params = new HttpParams({
      fromObject: query
    });

    return this.http.post('/authentication/myads' + url, params).pipe(
      tap(res => {}),
      catchError(e => {
        throw e;
      })
    );
  }

  getPostingDetail(id: string) {
    return this.http.post('/posting/' + id, {}).pipe(
      tap(res => {}),
      catchError(e => {
        throw e;
      })
    );
  }

  setActivateAds(id: string, unique_id: string, email: string) {
    let body = {
      unique_id,
      email
    };
    let url = `/posting/${id}/activate`;
    return this.http.post(url, body).pipe(
      tap(res => {}),
      catchError(e => {
        throw e;
      })
    );
  }

  createAds(data: any) {
    return this.http.post('/posting', data).pipe(
      tap(res => {}),
      catchError(e => {
        console.log(e);
        throw e;
      })
    );
  }

  updateAds(id: string, data: any) {
    const headers = new HttpHeaders().set('rest-api', environment.rest_api);
    return this.http.put(`/updatead/${id}`, data, { headers }).pipe(
      tap(res => {}),
      catchError(e => {
        throw e;
      })
    );
  }

  deleteAds(id: string, unique_id: string, email: string) {
    let body = {
      unique_id: unique_id,
      email: email
    };
    let url = `/posting/${id}/activate`;
    return this.http.delete(url).pipe(
      tap(res => {}),
      catchError(e => {
        throw e;
      })
    );
  }
}
