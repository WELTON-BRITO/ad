import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpService } from '../../../shared/services/http/http-client.service';

const API = environment.url_server;

@Injectable({
  providedIn: 'root'
})
export class ModalAgendaPacienteService {

  constructor(
    private httpService: HttpService
  ) { }

  
}
