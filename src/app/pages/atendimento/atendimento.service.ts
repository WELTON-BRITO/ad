import { Injectable } from '@angular/core';
import { HttpService } from '../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {

  constructor(private httpService:HttpService) { }

  buscaDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/all', data, successHandle, erroHandle)
  }

  buscaSpecialty(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/specialty/all', data, successHandle, erroHandle)
  }

  buscaAtendimentos(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/appointments/all', data, successHandle, erroHandle)
  }

  cancelarAtendimento(data: any, successHandle:Function, errorHandle:Function) {
    this.httpService.doPut('/api/appointments',data, successHandle, errorHandle);
  }

}
