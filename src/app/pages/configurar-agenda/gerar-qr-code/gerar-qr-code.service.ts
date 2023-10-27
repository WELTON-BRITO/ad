import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class GerarQrCodeService {

  constructor(private httpService:HttpService) { }
 
  buscaValor(data:any, doctorId, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/doctor/' + doctorId + '/price', data, successHandle, erroHandle)
  }

  salvarQRCode(data: any, successHandle: Function, errorHandle: Function) {
    return this.httpService.doPut('/api/doctor/price', data, successHandle, errorHandle);
  }

 }
