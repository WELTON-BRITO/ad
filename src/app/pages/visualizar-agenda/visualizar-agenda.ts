import { Injectable } from '@angular/core';
import { HttpService } from '../shared/services/http/http-client.service';

@Injectable({
    providedIn: 'root'
})
export class VisualizarAgendaService {

   constructor(private httpService: HttpService) { }

    buscaAtendimentos(data: any, successHandle: Function, erroHandle: Function) {
      return this.httpService.doGet('/api/appointments/status/all', data, successHandle, erroHandle);
    }


  cancelarAtendimento(data: any, successHandle:Function, errorHandle:Function) {
    this.httpService.doPut('/api/appointments',data, successHandle, errorHandle);
  }

  aprovarPagamento(data,idAtendimento: any , successHandle:Function, errorHandle:Function) {
    this.httpService.doPut('/api/appointments/' + idAtendimento + '/approvePayment',data, successHandle, errorHandle);
  }

  visualizarAnexo(id: any, data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/appointments/paymentProof/' + id, data, successHandle, erroHandle)
  }

}