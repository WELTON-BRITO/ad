import { Injectable } from '@angular/core';
import { HttpService } from '../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {

  constructor(private httpService: HttpService) { } 

  buscaSpecialty(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/specialty/all', data, successHandle, erroHandle)
  }

  buscaAtendimentos(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/appointments/all', data, successHandle, erroHandle)
  }

  buscaPagamentos(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/configuration/payment/all', data, successHandle, erroHandle)
  }

  buscaConvenio(id:any, data:any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGet('/api/healthPlan/doctor/' + id, data, successHandle, erroHandle)
  } 
  
  buscaDependente(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/child/all', data, successHandle, erroHandle)
  }

  buscaPaciente(data, cpf:any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/user/' + cpf + '/details', data, successHandle, erroHandle)
  }
 
  salvarAgendamento(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doPost('/api/appointments', data, successHandle, erroHandle)
  }

  buscaHorario(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/appointments/times', data, successHandle, erroHandle)
  }

  verificaEspecialidade(id: any, data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/specialty/doctor/' + id, data, successHandle, erroHandle)
  }
  
  cancelarAtendimento(data: any, successHandle:Function, errorHandle:Function) {
    this.httpService.doPut('/api/appointments',data, successHandle, errorHandle);
  }

  aprovarPagamento(data,idAtendimento: any , successHandle:Function, errorHandle:Function) {
    this.httpService.doPut('/api/appointments/' + idAtendimento + '/approvePayment',data, successHandle, errorHandle);
  }

  salvarDetalheAtendimento(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doPost('/api/appointments/details', data, successHandle, erroHandle)
  }

  visualizarHistorico(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/appointments/details', data, successHandle, erroHandle)
  }

  resetPassword(data: any, successHandle: Function, errorHandle: Function) {
    return this.httpService.doPost('/api/user/resetPassword', data, successHandle, errorHandle)
  }

  visualizarAnexo(id: any, data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/appointments/paymentProof/' + id, data, successHandle, erroHandle)
  }

  waitingService(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/waitingService', data, successHandle, erroHandle)
  }
  
  waiting(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doPost('/api/waitingService/proposal', data, successHandle, erroHandle)
  }

  timeAvailable(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/appointments/timeAvailable', data, successHandle, erroHandle)
  }
}
