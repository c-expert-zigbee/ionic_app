import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AppService } from './app.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private http: HttpClient,
    private appService: AppService,
    private storageService: StorageService
  ) {
    this.platform.ready().then(async () => {
      this.checkStorageData();
    });
  }

  isAuthenticated() {
    return this.authState.value;
  }

  private checkStorageData() {
    Promise.all([this.storageService.get('sessionData'), this.storageService.get('authenticated')]).then(res => {
      const [session, auth] = res;
      if (auth == true) {
        this.authState.next(true);
      }
    });
  }

  /**
   * Register with email
   *
   * @param {email: email} credentials
   * @return {Observable<any>}
   */
  createAccount(credentials: any): Observable<any> {
    this.appService.showLoader();
    let params = new HttpParams({
      fromObject: credentials
    });
    return this.http.post('/authentication/register', params).pipe(
      tap(res => {
        this.appService.dismissLoader();
      }),
      catchError(e => {
        this.appService.dismissLoader();
        throw e;
      })
    );
  }

  /**
   * Reset password with email
   *
   * @param {email} credentials
   * @return {Observable<any>}
   */
  sendAuthLink(email: string): Observable<any> {
    this.appService.showLoader();
    return this.http.get('/authentication?email=' + email).pipe(
      tap(res => {
        this.appService.dismissLoader();
      }),
      catchError(e => {
        this.appService.dismissLoader();
        throw e;
      })
    );
  }

  login(credentials: any): Observable<any> {
    let params = new HttpParams({
      fromObject: credentials
    });
    return this.http.post('/authentication', params).pipe(
      tap(res => {}),
      catchError(e => {
        throw e;
      })
    );
  }

  getProfile(): Observable<any> {
    return this.http.post('/authentication/myprofile', {}).pipe(
      tap(res => {}),
      catchError(e => {
        throw e;
      })
    );
  }

  logout() {
    this.storageService.clear();
    this.authState.next(false);
  }
}
