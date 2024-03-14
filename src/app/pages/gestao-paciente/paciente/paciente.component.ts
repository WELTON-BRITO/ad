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
  public avatar = "assets/images/avatar.png";

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: PacienteService,
    private toastrService: NbToastrService,
    private errorHandler: ErrorHandler) { }

  ngOnInit() {

    this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));
    this.formPaciente = this.formBuilder.group({
      cpf: [null],
      medico: [this.listMedico[0], Validators.required],
    })

    this.formPaciente.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });

    let registe = {
      cpf: null,
      medico: this.listMedico[0].id
    }
    this.pesquisaGeral(registe)

  }

  pesquisaGeral(data) {

    let params = new HttpParams();

    if (data.medico != null) {
      params = params.append('doctorId', data.medico)
    }
    if (data.cpf != null) {
      params = params.append('federalId', data.cpf)
    }

    if ((data.cpf != null) || (data.medico != 'null')) {

      this.isActive = true;

      this.service.buscaPaciente(params, (response) => {

        this.isActive = false;
        this.rowData = response

        this.rowData = this.rowData.map(data => {
          return {
            avatar: data.avatar == null || data.avatar == "" ? this.avatar : 'data:application/pdf;base64,' + data.avatar,
            name: data.name,
            cellPhone: data.cellPhone,
            email: data.emailUser,
            federalId: data.federalId,
            id: data.idPatient,
           // city: data.city.id,
          //  uf: data.uf.id,
          //  userChildren: data.userChildren,
            //doctorId: data.doctor.id
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

  cadastrar(data) {
    let register = {
      data: data,
      tipo: 'cadastrar'
    }

    this.router.navigateByUrl('/pages/gestao-paciente/dependente', { state: register });
  }

  visualizar(data) {
    let register = {
      data: data,
      tipo: 'visualizar'
    }
    this.router.navigateByUrl('/pages/gestao-paciente/dependente', { state: register });
  }

  novoPaciente() {
    this.router.navigate(['/pages/gestao-paciente/novo-paciente']);
  }

  precoEspecial(data) {
    this.router.navigateByUrl('/pages/gestao-paciente/preco-especial', { state: data });
  }

  buscaHistorico(data) {
    this.router.navigateByUrl('/pages/gestao-paciente/historico', { state: data });
  }
}
