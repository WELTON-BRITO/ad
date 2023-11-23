import { Injectable } from '@angular/core';
import { HttpService } from '../shared/services/http/http-client.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SolicitarSenhaService {

  constructor(private httpService: HttpService, private http: HttpClient) { }
  
  resetPassword(data, successHandle: Function, errorHandle: Function) {
    return this.httpService.doPost('/api/user/resetPassword', data, successHandle, errorHandle)
  }
  
}
