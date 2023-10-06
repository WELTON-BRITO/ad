import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class GerarQrCodeService {

  constructor(private httpService:HttpService) { }

  buscaDoctor(data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/all', data, successHandle, erroHandle)
  }

  buscaClinica(id: any, data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/clinic/' + id, data, successHandle, erroHandle)
  }

  buscaValor(data:any, doctorId, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/' + doctorId + '/price', data, successHandle, erroHandle)
  }

  salvarQRCode(data: any, successHandle: Function, errorHandle: Function) {
    return this.httpService.doPut('/api/doctor/price', data, successHandle, errorHandle);
  }

 }
