import { Injectable } from '@angular/core';
import { HttpService } from '../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {

  constructor(private httpService: HttpService) { }

  buscaDoctor(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/doctor/all', data, successHandle, erroHandle)
  }

  buscaClinica(id: any, data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/doctor/clinic/' + id, data, successHandle, erroHandle)
  }

  buscaSpecialty(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/specialty/all', data, successHandle, erroHandle)
  }

  buscaAtendimentos(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/appointments/all', data, successHandle, erroHandle)
  }

  buscaPagamentos(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/configuration/payment/all', data, successHandle, erroHandle)
  }

  buscaConvenio(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/healthPlan/all', data, successHandle, erroHandle)
  }

  buscaDependente(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/child/all', data, successHandle, erroHandle)
  }

  buscaPaciente(data: any, successHandle: Function, erroHandle: Function) {
    return this.httpService.doGet('/api/patient/all', data, successHandle, erroHandle)
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
}
