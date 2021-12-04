import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
// import { authConfig } from '../config';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // get id token
    // this.auth.idTokenClaims$.subscribe(
    //   (token) => {
    //     console.log(`token_id = ${token.__raw}`)
    //     request = request.clone({
    //       setHeaders: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${token.__raw}`
    //       }
    //     });
    //     console.log(request.headers);
    //   }

    // )
    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token_id')}`
      }
    });
    console.log(request.headers);
    
    return next.handle(request);
  }
}
