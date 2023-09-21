import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(private httpService:HttpService) { }

  buscaDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/all', data, successHandle, erroHandle)
  }

  buscaPaciente(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/patient/all', data, successHandle, erroHandle)
  }
  
}
