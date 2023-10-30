import { Component, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  public isActive = false;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: PacienteService,
    private toastrService: NbToastrService,
    private errorHandler: ErrorHandler) { }

  ngOnInit() {

    this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));

    this.formPaciente = this.formBuilder.group({
      pesquisa: [null],
      medico: [this.listMedico[0], Validators.required]
    })

    this.formPaciente.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true }); // use the id of the first medico

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
            federalId: data.user.federalId,
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

  novoPaciente() {
    this.router.navigate(['/pages/gestao-paciente/novo-paciente']);
  }
}
