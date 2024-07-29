import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(request.url.endsWith('/json')) {
      return next.handle(request);
    }

    if (request.url.endsWith('/api/auth')) {
      return next.handle(request);
    }   

    const authRequest = request.clone({ headers: this.getHeaderToken() });
    return next.handle(authRequest);
  }

  getHeaderToken() {
    const token = localStorage.getItem('Authorization');
    if(token == null || token ==''){
      const token = sessionStorage.getItem('Authorization');
    }

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Authorization' , token);
    return headers;
  }

}