import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http/http-client.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlterarSenhaService {

  constructor(
    private httpService: HttpService,
    private httpClient: HttpClient
  ) { } 
}
