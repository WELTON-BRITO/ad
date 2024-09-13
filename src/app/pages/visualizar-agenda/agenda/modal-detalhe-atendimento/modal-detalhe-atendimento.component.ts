import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { MotivoCancelamentoComponent } from '../../../atendimento/detalhe-atendimento/motivo-cancelamento/motivo-cancelamento.component';
//import { VisualizarAgendaService } from '../../visualizar-agenda';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AtendimentoService } from "../../../atendimento/atendimento.service";


@Component({
  selector: 'ngx-modal-detalhe-atendimento',
  templateUrl: './modal-detalhe-atendimento.component.html',
  styleUrls: ['./modal-detalhe-atendimento.component.scss']
})
export class ModalDetalheAtendimentoComponent implements OnInit {

  @Input() dados: any;

  private card: ElementRef;
  public formDetalheAtendimento = null;
  public detalheConsulta = null;
  public status = null;
  public isLoader: boolean = false;
  public atendimento = {
    medico: null,
    paciente: null,
    data: null,
    horario: null,
    nomeResponsavel: null,
    formaPagamento: null,
    modalidade: null,
    convenio: null,
    observacoes: null,
    status: null,
    urlCall: null,
    comprovante: null,
    especialidade: null,
    prescricao: null,
    atestado: null,
    id: null,
    nameMother: null,
    nameFather: null,
    isConfirmed: null,
    telefone: null,
  };
  public isActive = false;

  constructor(
    private formBuilder: FormBuilder,
    protected ref: NbDialogRef<ModalDetalheAtendimentoComponent>,
    private service: AtendimentoService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private location: Location,
    private router: Router,
  ) {

    this.formDetalheAtendimento = this.formBuilder.group({
      cpf: [null],
      dataConsulta: [null],
      detalheConsulta: [null],
      horaConsulta: [null],
      clinica: [null],
      nameMedico: [null],
      timeConsulta: [null],
      preco: [null]

    });

  }

  close() {
    this.ref.close();
  }

  ngOnInit() {

    this.atendimento.medico = this.dados._def.extendedProps.medico,
      this.atendimento.paciente = this.dados._def.extendedProps.paciente,
      this.atendimento.data = moment(this.dados._def.extendedProps.data).format('DD/MM/YYYY'),
      this.atendimento.horario = this.dados._def.extendedProps.horario,
      this.atendimento.formaPagamento = this.dados._def.extendedProps.typePayment,
      this.atendimento.modalidade = this.dados._def.extendedProps.typeService,
      this.atendimento.status = this.dados._def.extendedProps.status,
      this.atendimento.id = this.dados._def.publicId,
      this.atendimento.nameMother = this.dados._def.extendedProps.nameMother,
      this.atendimento.nameFather = this.dados._def.extendedProps.nameFather,
      this.atendimento.nomeResponsavel = this.dados._def.extendedProps.responsavel;
      this.atendimento.isConfirmed = this.dados._def.extendedProps.isConfirmed;
      this.atendimento.telefone = this.dados._def.extendedProps.telefone;


  }

  fetchData(data) {
    if (data) {
      // Mostra o loader
      this.isLoader = true
    } else {
      setTimeout(() => {
        // Oculta o loader após o atraso
        this.isLoader = false
      }, 2000);
    }
  }

  confirmarHorario(data){

    this.fetchData(true)
    this.isActive = true

    this.service.confirmarConsulta(data.id,'true', (response) => {
      this.isActive = false
      this.toastrService.success('Atendimento Confirmado com Sucesso', 'Aditi Care!');
      data.isConfirmed = 'Horário Confirmado';
      this.fetchData(false)

    }, (message) => {
      if(message.code ===200){
      this.toastrService.success('Atendimento Confirmado com Sucesso', 'Aditi Care!');
      data.isConfirmed = 'Horário Confirmado';
      this.fetchData(false)
    }
else{
  
  this.toastrService.danger('Ocorreu um Erro ao Confirmar o Horário, tente novamente mais tarde', 'Aditi Care!');
  this.fetchData(false)

}
      this.isActive = false;
    });
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  abrirConsulta(data) {

    let rowData =  this.dados._def.extendedProps.dados;
    rowData.patchPaciente = true;
    this.ref.close();
    this.router.navigateByUrl('/pages/atendimento/detalhe-atendimento', { state: rowData });
  }

  editarConsulta() {
    let rowData =  this.dados._def.extendedProps.dados;
    rowData.patchPaciente = true;
    this.ref.close();
    this.router.navigateByUrl('/pages/atendimento/agendar-consulta', { state: rowData });
  }

  desbloquear(data) {

    this.isActive = true

    let register = {
      'id': data.id,
      'reasonCancellation': 'Botão Cancelar'
    }
    this.fetchData(true)

    this.service.cancelarAtendimento(register, (response) => {
      this.isActive = false
      this.toastrService.success('Atendimento Desbloqueado com Sucesso', 'Aditi Care!');
      this.fetchData(false)

    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);
      this.fetchData(false)

    });
  }

}
