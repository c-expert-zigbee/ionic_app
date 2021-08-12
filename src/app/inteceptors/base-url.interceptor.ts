import { Injectable } from '@angular/core';
import {
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

import { environment as env } from '../../environments/environment';
import { AppService } from '../services/app.service';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  constructor(private storage: Storage, public appService: AppService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.storage.get('sessionData')).pipe(
      switchMap(sessionData => {
        let access_key = '';
        let api_key = '';
        if (sessionData) {
          let session = JSON.parse(sessionData);
          if (session.access_key && session.access_key !== undefined) {
            access_key = session.access_key;
          }
          if (session.api_key && session.api_key !== undefined) {
            api_key = session.api_key;
          }
        }
        let url = env.address + env.proxy + '/' + env.version;
        let contentType = 'application/x-www-form-urlencoded';
        if (request.headers.has('rest-api')) {
          url = request.headers.get('rest-api');
          contentType = 'application/json';
        }
        request = request.clone({
          setHeaders: {
            'Content-Type': contentType,
            PROJECT_KEY: env.project_key,
            ACCESS_KEY: access_key,
            API_KEY: api_key
          },
          url: url + request.url
        });
        console.log(request);
        return next.handle(request).pipe(
          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              // do nothing for now
            }
            return event;
          }),
          catchError((error: HttpErrorResponse) => {
            console.log(error);
            const status = error.status;
            const reason = error && error.error.reason ? error.error.reason : '';
            this.appService.dismissLoader();
            this.appService.showLongCenterMsg(reason);
            return throwError(error);
          })
        );
      })
    );
  }
}
