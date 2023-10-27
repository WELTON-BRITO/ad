import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';
import { an } from '@fullcalendar/core/internal-common';

@Injectable({
  providedIn: 'root'
})
export class ParametrizarPlanoService {

  constructor(private httpService:HttpService) { }
 
  convenioAssociado(id:any, data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/healthPlan/doctor/' + id, data, successHandle, erroHandle)
  } 

  cadastrarConvenio(data: any, successHandle: Function, errorHandle: Function) {
    return this.httpService.doPost('/api/doctor/healthPlan', data, successHandle, errorHandle);
  }

  removerConvenio(doctorId: any, data: any, successHandle:Function, errorHandle:Function) {

    this.httpService.doPut('/api/doctor/'+ doctorId +'/healthPlan',data, successHandle, errorHandle);

  }
 
}
