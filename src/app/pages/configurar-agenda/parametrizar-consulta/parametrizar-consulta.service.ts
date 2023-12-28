import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrizarConsultaService {

  constructor(private httpService:HttpService) { } 

  cadastrarPriceDoctor(data: any, successHandle: Function, errorHandle: Function) {
    return this.httpService.doPost('/api/doctor/typePrice', data, successHandle, errorHandle);
  }

  buscaValor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/typePrice', data, successHandle, erroHandle)
  }

  atualizarValor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doPost('/api/doctor/typePrice', data, successHandle, erroHandle)
  }

  buscaClinica(id: any, data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/clinic/doctor/' + id, data, successHandle, erroHandle)
  } 

}
