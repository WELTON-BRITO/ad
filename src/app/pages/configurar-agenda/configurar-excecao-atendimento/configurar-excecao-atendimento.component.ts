/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { ConfigurarExcecaoAtendimentoService } from './configurar-excecao-atendimento.service';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import * as moment from 'moment';


@Component({
  selector: 'ngx-configurar-excecao-atendimento',
  styleUrls: ['./configurar-excecao-atendimento.component.scss'],
  templateUrl: './configurar-excecao-atendimento.component.html',
})
export class ConfigurarExcecaoAtendimentoComponent implements OnDestroy {

  public formExcecaoAtendimento = null;
  public tipoCard: any[] = [{
    id: '',
    horaInicio: '',
    horaFim: ''
  }];
  public grupoCard = null;
  public card = null;
  public listMedico = null;
  public isCardHoras = false;
  public isActive = false;
  public rowData = null;
  public doctorId = null;
  public horaInicio = [];
  public horaFim = [];
  public clinicaId = null;
  public listClinica = [];
  public listTipoConsulta = [];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: ConfigurarExcecaoAtendimentoService,
    private toastrService: NbToastrService) {

    this.tipoCard = [];
    this.grupoCard = [];

    this.listTipoConsulta = [{
      id: 1,
      descricao: "Presencial"
    },
    {
      id: 2,
      descricao: "Video Chamada"
    },
    {
      id: 3,
      descricao: "Emergencial Presencial"
    },
    {
      id: 4,
      descricao: "Em Casa"
    },
    {
      id: 5,
      descricao: "Video Chamada Emergencial"
    }];

  }
  ngOnDestroy() { }

  ngOnInit() {

    this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));
    this.verificaMedico(this.listMedico[0].id);
    this.pesquisaClinica(this.listMedico[0].id)
    this.formExcecaoAtendimento = this.formBuilder.group({
      dataExcecao: [null],
      horaInicio: [null],
      horaFim: [null],
      card: [null],
      medico: [this.listMedico[0], Validators.required],
      clinica: [null],
      tipoConsulta: [null]
    })

    this.formExcecaoAtendimento.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true }); // use the id of the first medico


  }

  addHora() {

    this.tipoCard.push({
      id: this.tipoCard.length + 1,
    })
  }

  removerCard() {

    this.tipoCard.splice(this.tipoCard.indexOf(3), 1);

  }

  expediente(data) {

    if (data === 'S') {
      this.isCardHoras = true
    } else {
      this.isCardHoras = false
    }
  }

  buscarExcecaoDoctor(data) {

    let params = new HttpParams();

    params = params.append('doctorId', data)

    this.service.buscarExcecaoDoctor(params, (response) => {

      this.rowData = response;

      if (response.length != 0) {
        this.rowData = this.rowData.map(data => {
          return {
            nome: data.doctor.name.split(' ')[0],
            data: moment(data.dateException).format("DD/MM/YYYY"),
            horaInicio: data.startTime == null ? 'sem expediente' : data.startTime,
            horaFim: data.endTime == null ? 'sem expediente' : data.endTime,
          }
        })
      } else {
        this.toastrService.warning('Ainda não foi configurado nenhuma exceção no horário de atendimento !!!');
      }

    }, (error) => {
      this.toastrService.danger(error.error.message);
    });

  }

  salvar(data) {

    for (var i = 0; i < this.tipoCard.length; i++) {

      if (this.tipoCard[i].horaInicio != null) {
        this.horaInicio.push(this.tipoCard[i].horaInicio)
      }
      if (this.tipoCard[i].horaFim != null) {
        this.horaFim.push(this.tipoCard[i].horaFim)
      }

    }

    let register = {
      doctorId: this.doctorId,
      clinicId: this.clinicaId,
      startTime: this.horaInicio,
      endTime: this.horaFim,     
      dateException: data.dataExcecao,
      away: this.isCardHoras
    }

    if ((this.doctorId != null) && (data.dataExcecao != null) && ((this.isCardHoras == true) || (this.isCardHoras == false))) {

      this.isActive = true;

      this.service.salvarExcecaoDoctor(register, (response => {
        this.isActive = false;
        this.toastrService.success('Registro cadastrado com sucesso !!!');
        this.buscarExcecaoDoctor(response.doctor.id)
        this.limpaForm()
      }), (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);
      });
    } else {
      this.toastrService.danger('Preencher os campos obrigatório!!!');
    }

    this.horaInicio = [];
    this.horaFim = [];

  }

  limpaForm() {

    this.formExcecaoAtendimento = this.formBuilder.group({
      dataExcecao: [null],
      horaInicio: [null],
      horaFim: [null],
      card: [null],
      medico: [null],
      clinica: [null],
      tipoConsulta: [null]
    })

    this.removerCard()
  }

  verificaMedico(data) {

    if (data != 'null') {
      this.doctorId = data
      this.buscarExcecaoDoctor(data)
    } else {
      this.toastrService.danger('Preencher o campo obrigatório!!!');
    }

  }

  pesquisaClinica(data) {

    this.service.buscaClinica(data, null, (response) => {

      this.listClinica = response
      this.isActive = false

    }, (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);
    });

  }

  verificaClinica(data) {
    this.clinicaId = data;
  }

}
