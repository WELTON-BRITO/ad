import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class AssociarMedicoService {

  constructor(private httpService:HttpService) { }

  buscaDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/all', data, successHandle, erroHandle)
  }

  associarDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doPost('/api/clinic/associate/doctor', data, successHandle, erroHandle)
  }

  
}
