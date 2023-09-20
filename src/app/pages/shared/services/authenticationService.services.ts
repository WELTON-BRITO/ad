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
  
  getToken(login, password): Observable<any> {
      const loginForm = {
        login: login,
        password: password,
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
    
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');  
    localStorage.clear(); 
    this.router.navigate(['/login']);        
     
  } 
 

}
