import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurarDiaAtendimentoService {

  constructor(private httpService:HttpService) { }

  buscaDiaAtendimento(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('', data, successHandle, erroHandle)
  }
   
  salveAtenHora(data: any, successHandle: Function, errorHandle: Function) {
    return this.httpService.doPost('/api/schedule', data, successHandle, errorHandle);
  }

  agendaDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/schedule/all', data, successHandle, erroHandle)
  }

  buscaClinica(id: any, data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/clinic/doctor/' + id, data, successHandle, erroHandle)
  } 

  buscaModalidade(doctorId: any, data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/configuration/service/doctor/'+ doctorId +'/typePrice', data, successHandle, erroHandle)
  } 

}
