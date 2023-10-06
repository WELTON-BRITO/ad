import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class NovoPacienteService {

  constructor(private httpService: HttpService) { }

  buscaDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/all', data, successHandle, erroHandle)
  }

  buscaClinica(id: any, data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/clinic/' + id, data, successHandle, erroHandle)
  } 

  buscaEstado(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/uf/all', data, successHandle, erroHandle)
  }

  buscaConvenio(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/healthPlan/all', data, successHandle, erroHandle)
  }
  
  buscaCidade(data, ufId:any,successHandle: Function, errorHandle: Function){
    return this.httpService.doGet('/api/city/uf/' + ufId + '/all',  data, successHandle, errorHandle)
  }

  salvarPaciente(data: any, successHandle: Function, errorHandle: Function) {
    return this.httpService.doPost('/api/patient/register', data, successHandle, errorHandle);
  }

}
