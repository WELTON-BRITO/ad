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

  buscaDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/all', data, successHandle, erroHandle)
  }

  salveAtenHora(data: any, successHandle: Function, errorHandle: Function) {
    return this.httpService.doPost('/api/schedule', data, successHandle, errorHandle);
  }

  agendaDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/schedule/all', data, successHandle, erroHandle)
  }

}
