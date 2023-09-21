import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrizarPlanoService {

  constructor(private httpService:HttpService) { }

  buscaDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/all', data, successHandle, erroHandle)
  }

  buscaConvenio(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/healthPlan/all', data, successHandle, erroHandle)
  }

}
