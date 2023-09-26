import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class NovoPacienteService {

  constructor(private httpService: HttpService) { }

  buscaEstado(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/uf/all', data, successHandle, erroHandle)
  }

  buscaConvenio(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/healthPlan/all', data, successHandle, erroHandle)
  }
  
  buscaCidade(data, ufId:any,successHandle: Function, errorHandle: Function){
    return this.httpService.doGet('/api/city/uf/' + ufId + '/all',  data, successHandle, errorHandle)
  }

}
