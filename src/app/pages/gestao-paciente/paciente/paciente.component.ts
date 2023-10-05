import { Component, OnInit } from '@angular/core';
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
    private toastrService: NbToastrService,) { }

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

    let params = new HttpParams();

    params = params.append('doctorId', data.medico)

    if (data.cnpjCpf != null) {
      params = params.append('name', data.cnpjCpf)
    }

    if (data.cnpjCpf != null) {
      params = params.append('federalId', data.cnpjCpf)
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


    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);   
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

    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);
    });

  }

  novoPaciente() {
    this.router.navigate(['/pages/gestao-paciente/novo-paciente']);
  }
}
