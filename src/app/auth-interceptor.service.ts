import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor() { }

  intercept(req: any, next: any) {
    if (localStorage.getItem('access_token')) {
      var token = localStorage.getItem('access_token');

      var authRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      return next.handle(authRequest);
    }

    next.handle(req);
  }
}
