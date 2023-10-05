import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { HttpService } from '../../../pages/shared/services/http/http-client.service';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {

  headerInformation = null;
  constructor(private http: HttpClient,
              private httpService: HttpService,
              ) { }


  assignHeaderInformation(headerInformation: any) {
    this.headerInformation = headerInformation;
  }

  getHeaderInformation() {
    return this.headerInformation;
  }

}
