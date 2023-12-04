import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class SearchZipCodeService {

  constructor(private httpService: HttpService) { } 

  buscaCep(cep: any, data: any, successHandle: Function, erroHandle: Function){
    return this.httpService.doGetCep('/ws/' + cep  + '/json/', data, successHandle, erroHandle);
  }

}
