import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {SettingsService} from '../_services/settings.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    public config: SettingsService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {

        let error = err.message || err.statusText;
        console.log(error);

        if (err.status === 401 || err.status === 500) {
          // auto logout if 401 response returned from api
          this.config.logout();
          location.reload(true);
        }

        if (err.status === 0) {
          if (this.config.haveCatalogAccess()) {
            this.config.logout();
          }
          error = 'Unable to Connect to the API Server';
        }

        console.log(error);
        this.config.setError(error);
        return throwError(error);
      })
    );
  }
}
