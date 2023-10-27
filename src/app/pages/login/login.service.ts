import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../shared/services/http/http-client.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpService: HttpService) { }

  private toggle:boolean = true;

  isToggle():boolean{
      return this.toggle;
  }

  setToggle(data:boolean){
    this.toggle = data;
  }

  buscaDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/all', data, successHandle, erroHandle)
  }

  buscaClinica(id: any, data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/clinic/' + id, data, successHandle, erroHandle)
  } 
  
}
