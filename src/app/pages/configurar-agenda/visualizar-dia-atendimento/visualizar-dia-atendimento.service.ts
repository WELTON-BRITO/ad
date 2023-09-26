import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class VisualizarDiaAtendimentoService {

  constructor(private httpService:HttpService) { }

  buscaDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/all', data, successHandle, erroHandle)
  }

  agendaDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/schedule/all', data, successHandle, erroHandle)
  }
 
}
