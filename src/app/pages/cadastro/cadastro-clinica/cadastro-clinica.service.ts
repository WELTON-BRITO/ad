import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class CadastroClinicaService {

  constructor( private httpService: HttpService) { }

  cadastrarClinica(data: any, successHandle: Function, errorHandle: Function) {
    return this.httpService.doPost('/api/clinic', data, successHandle, errorHandle);
  }

  buscaEstado(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/uf/all', data, successHandle, erroHandle)
  }

}
