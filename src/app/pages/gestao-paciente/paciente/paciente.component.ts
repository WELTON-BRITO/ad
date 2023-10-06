import { Component, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from './paciente.service';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import * as moment from 'moment';

@Component({
  selector: 'ngx-paciente',
  styleUrls: ['./paciente.component.scss'],
  templateUrl: './paciente.component.html',
})
export class PacienteComponent implements OnInit {

  public formPaciente = null;
  public listPaciente = null;
  public rowData = null;
  public listMedico = null;
  public isActive = true;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: PacienteService,
    private toastrService: NbToastrService,
    private errorHandler: ErrorHandler) { }

  ngOnInit() {

    var name = localStorage.getItem('bway-domain');
    var id = localStorage.getItem('bway-entityId');   
    
    if(name == 'CLINIC'){
      this.pesquisaClinica(id)
    }else{
      this.pesquisaMedico(id);
    }

    this.formPaciente = this.formBuilder.group({
      pesquisa: [null],
      medico: [null]
    })

  }

  pesquisaGeral(data) {

    console.log(data)

    let params = new HttpParams();

    params = params.append('doctorId', data.medico)
   
    if (data.pesquisa != null) {
      console.log('entrei aqui no cpf 2')
      params = params.append('federalId', data.pesquisa)
    }

    this.isActive = true;

    this.service.buscaPaciente(params, (response) => {

      this.isActive = false;
      this.rowData = response

      this.rowData = this.rowData.map(data => {       

        return {
          avatar: 'data:application/pdf;base64,' + data.avatar,
          name: data.user.name,
          cellPhone: data.user.cellPhone,
          birthDate:  moment(data.user.birthDate).format('DD/MM/YYYY'),        
        }
      })


    }, (error) => {
      console.log('entrei dentro do erro')
      console.log(error)
      this.isActive = false;
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
      this.toastrService.danger(error.error.message);  

    });
  }

  pesquisaMedico(data) {

    this.isActive = true

    let params = new HttpParams();
    params = params.append('doctorId', data)

    this.service.buscaDoctor(params, (response) => {

      this.listMedico = response
      this.isActive = false

    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);
    });    

  }
 
 pesquisaClinica(data) {
    this.isActive = true   
    this.service.buscaClinica(data, null, (response) => {

      this.listMedico = response
      this.isActive = false

    },(error) => {
      console.log('entrei dentro do erro')
      console.log(this.errorHandler.handleError(error))
      this.isActive = false;
      this.errorHandler.handleError(error);
      
      this.toastrService.danger(error.error.message);  

    });

  }

  novoPaciente() {
    this.router.navigate(['/pages/gestao-paciente/novo-paciente']);
  }
}
