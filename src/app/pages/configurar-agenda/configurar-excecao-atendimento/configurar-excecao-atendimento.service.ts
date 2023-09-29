import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurarExcecaoAtendimentoService {

  constructor(private httpService:HttpService) { }

  buscaDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/all', data, successHandle, erroHandle)
  }

  buscaClinica(id: any, data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/clinic/' + id, data, successHandle, erroHandle)
  } 

  buscarExcecaoDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/schedule/exception/all', data, successHandle, erroHandle)
  }

  salvarExcecaoDoctor(data: any, successHandle: Function, errorHandle: Function) {
    return this.httpService.doPost('/api/schedule/exception', data, successHandle, errorHandle);
  }


}
