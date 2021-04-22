import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import {SettingsService} from '../_services/settings.service';

@Injectable()
export class DmInterceptor implements HttpInterceptor {
  constructor(
    public config: SettingsService
  ) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with token if available
    const currentToken = this.config.getToken();
    if (currentToken !== '') {
      // console.log(request);
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentToken}`
        }
      });
      // console.log(request);
    }
    return next.handle(request);
  }


}
