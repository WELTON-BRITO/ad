import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class PrecoEspecialService {

  constructor(private httpService:HttpService) { } 

  cadastrarPriceExclusive(data: any, successHandle: Function, errorHandle: Function) {
    return this.httpService.doPost('/api/doctor/price/exclusive', data, successHandle, errorHandle);
  }

  buscaValor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/price/exclusive', data, successHandle, erroHandle)
  }

  buscaClinica(id: any, data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/clinic/doctor/' + id, data, successHandle, erroHandle)
  } 

}
