import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { MotivoCancelamentoComponent } from '../../../atendimento/detalhe-atendimento/motivo-cancelamento/motivo-cancelamento.component';
import { VisualizarAgendaService } from '../../visualizar-agenda';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

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
    nameFather: null
  };
  public isActive = false;

  constructor(
    private formBuilder: FormBuilder,
    protected ref: NbDialogRef<ModalDetalheAtendimentoComponent>,
    private service: VisualizarAgendaService,
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

  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  abrirConsulta() {

    console.log(this.dados._def.extendedProps.dados)

    let rowData =  this.dados._def.extendedProps.dados;
    this.ref.close();
    this.router.navigateByUrl('/pages/atendimento/detalhe-atendimento', { state: rowData });
  }

  editarConsulta() {
    this.ref.close();
    this.router.navigateByUrl('/pages/atendimento/agendar-consulta', { state: this.dados._def.extendedProps.dados });
  }

}
