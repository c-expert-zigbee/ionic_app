import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyProfileService {
  constructor(private http: HttpClient, private storage: Storage) {}

  /**
   * Update profile
   *
   * @param data:Profile
   * @return {Observable<any>}
   */
  updateProfile(data: any): Observable<any> {
    const headers = new HttpHeaders().set('rest-api', environment.rest_api);
    return this.http.put('/updateprofile', data, { headers }).pipe(
      tap(res => {
        console.log(res);
      }),
      catchError(e => {
        throw e;
      })
    );
  }
}
