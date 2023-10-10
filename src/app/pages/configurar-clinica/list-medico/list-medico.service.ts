import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ListMedicoService {

  constructor(private httpService:HttpService) { }

  buscaDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/all', data, successHandle, erroHandle)
  }

  buscaDoctorClinic(clinicId:any, data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/clinic/'+ clinicId, data, successHandle, erroHandle)
  }

  doctorClinic(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doPut('/api/clinic/disassociate/doctor', data, successHandle, erroHandle)
  }

}
