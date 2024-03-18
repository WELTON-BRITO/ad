import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(private httpService:HttpService) { }

  buscaPaciente(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/patient/custom/all', data, successHandle, erroHandle)
  }

  buscaHistoricoPaciente(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/legacy/doctoralia/patient', data, successHandle, erroHandle)
  }

  buscaPhoto(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/user/photo', data, successHandle, erroHandle)
  }

  salvarImportacao(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doPost('/api/legacy/doctoralia/link', data,successHandle, erroHandle)
  }
  
}
