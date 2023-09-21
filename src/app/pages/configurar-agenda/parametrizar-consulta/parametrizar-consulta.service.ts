import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrizarConsultaService {

  constructor(private httpService:HttpService) { }

  buscaDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/all', data, successHandle, erroHandle)
  }

  cadastrarPriceDoctor(data: any, successHandle: Function, errorHandle: Function) {
    return this.httpService.doPost('/api/doctor/price', data, successHandle, errorHandle);
  }

}
