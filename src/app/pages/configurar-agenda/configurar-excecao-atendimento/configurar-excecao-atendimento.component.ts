import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  public isCardHoras = true;
  public isActive = true;
  public rowData = null;
  public doctorId = null;
  public horaInicio = null;
  public horaFim = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: ConfigurarExcecaoAtendimentoService,
    private toastrService: NbToastrService) {

    this.tipoCard = [];
    this.grupoCard = [];

  }
  ngOnDestroy() { }
  ngOnInit() {

    this.pesquisaMedico();

    this.formExcecaoAtendimento = this.formBuilder.group({
      dataExcecao: [null],
      horaInicio: [null],
      horaFim: [null],
      card: [null],
      medico: [null]
    })

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

  pesquisaMedico() {

    this.service.buscaDoctor(null, (response) => {

      this.listMedico = response
      this.isActive = false

    }, (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);
    });

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
            horaInicio: data.startTime,
            horaFim: data.endTime
          }
        })
      } else {
        this.toastrService.warning('Não possui exceção de atendimento !!!');
      }

    }, (error) => {
      this.toastrService.danger('Não possui hora marcada !!!');
    });

  }

  salvar(data) {

    if (this.isCardHoras == true) {
      this.horaInicio = this.tipoCard[0].horaInicio;
      this.horaFim = this.tipoCard[0].horaFim
    }

    let register = {
      doctorId: this.doctorId,
      clinicId: null,
      startTime: this.horaInicio,
      endTime: this.horaFim,
      dateException: data.dataExcecao,
      away: this.isCardHoras
    }

    this.isActive = true;

    this.service.salvarExcecaoDoctor(register, (response => {
      this.isActive = false;
      this.toastrService.success('Registro cadastrado com sucesso !!!');
      this.buscarExcecaoDoctor(response.doctor.id)
      this.limpaForm()
    }), error => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);
    });

  }

  limpaForm() {

    this.formExcecaoAtendimento = this.formBuilder.group({
      dataExcecao: [null],
      horaInicio: [null],
      horaFim: [null],
      card: [null],
      medico: [null]
    })

    this.removerCard()
  }

  verificaMedico(data) {

    this.doctorId = data
    this.buscarExcecaoDoctor(data)
  }

}
