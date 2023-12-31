import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

const API_LOGIN = environment.url_login;

@Injectable()
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private router: Router,

  ) { }
  
  getToken(login, password, domain): Observable<any> {
      const loginForm = {
        login: login,
        password: password,
        domain: domain,
        firebaseToken: ''
      };

      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
          'Content-Type':  'application/json'          
          })
      };
      
      return this.http.post<any>(API_LOGIN + '/api/auth/login', loginForm, httpOptions);

  }

  isLoggedIn(): Observable<any> {
    var token = localStorage.getItem('bway-token');
    return this.http.get(API_LOGIN + '/auth/token/validateToken?token=' + token);

  }

  doLogout() {
    
    var token = String(localStorage.getItem('bway-token'));
    token = token.replace('"', '').replace('"', '');   
    localStorage.setItem('bway-enterprise-name', '');
    localStorage.setItem('bway-user', '');   
    sessionStorage.removeItem('bway-medico');
    localStorage.removeItem('Authorization');    
    localStorage.removeItem('bway-logged-date');
    localStorage.removeItem('bway-domain');
    localStorage.removeItem('bway-entityId');
    this.router.navigate(['/login']);        
     
  } 
 

}
