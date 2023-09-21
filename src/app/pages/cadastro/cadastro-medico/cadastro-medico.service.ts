import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class CadastroMedicoService {

  constructor( private httpService: HttpService) { }

  cadastrarMedico(data: any, successHandle: Function, errorHandle: Function) {
    return this.httpService.doPost('/api/doctor',data, successHandle, errorHandle);
  }

  buscaEstado(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/uf/all', data, successHandle, erroHandle)
  }

  buscaSpecialty(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/specialty/all', data, successHandle, erroHandle)
  }

}
