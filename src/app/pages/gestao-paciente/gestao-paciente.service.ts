import { Injectable } from '@angular/core';
import { HttpService } from '../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class GestaoPacienteService {

  constructor(private httpService:HttpService) { } 
  
  appointments(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/appointments/all', data, successHandle, erroHandle)
  }

 
}