import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurarExcecaoAtendimentoService {

  constructor(private httpService:HttpService) { }
  
  buscarExcecaoDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/schedule/exception/all', data, successHandle, erroHandle)
  }

  salvarExcecaoDoctor(data: any, successHandle: Function, errorHandle: Function) {
    return this.httpService.doPost('/api/schedule/exception', data, successHandle, errorHandle);
  }

  buscaClinica(id: any, data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/clinic/doctor/' + id, data, successHandle, erroHandle)
  } 


}
