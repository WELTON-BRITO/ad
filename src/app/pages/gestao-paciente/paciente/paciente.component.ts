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

    if (name == 'CLINIC') {
      this.pesquisaClinica(id)
    } else {
      this.pesquisaMedico(id);
    }

    this.formPaciente = this.formBuilder.group({
      pesquisa: [null],
      medico: [null]
    })

  }

  pesquisaGeral(data) {

    let params = new HttpParams();

    if (data.medico != null) {
      params = params.append('doctorId', data.medico)
    }
    if (data.pesquisa != null) {
      params = params.append('federalId', data.pesquisa)
    }

    if ((data.pesquisa != null) || (data.medico != 'null')) {

      this.isActive = true;

      this.service.buscaPaciente(params, (response) => {

        this.isActive = false;
        this.rowData = response

        this.rowData = this.rowData.map(data => {

          return {
            avatar: 'data:application/pdf;base64,' + data.user.avatar,
            name: data.user.name,
            cellPhone: data.user.cellPhone,
            email: data.user.emailUser,
            birthDate: moment(data.user.birthDate).format('DD/MM/YYYY'),
          }
        })

      }, (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);
      });

    } else {
      this.toastrService.danger('O campos médico ou CPF são obrigatórios!!!');
    }

  }

  pesquisaMedico(data) {

    this.isActive = true

    let params = new HttpParams();
    params = params.append('doctorId', data)

    this.service.buscaDoctor(params, (response) => {

      this.listMedico = response
      this.isActive = false

    }, (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);
    });

  }

  pesquisaClinica(data) {
    this.isActive = true
    this.service.buscaClinica(data, null, (response) => {

      this.listMedico = response
      this.isActive = false

    }, (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);

    });

  }

  novoPaciente() {
    this.router.navigate(['/pages/gestao-paciente/novo-paciente']);
  }
}
