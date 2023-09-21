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

}
