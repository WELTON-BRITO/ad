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
      this.atendimento.nameFather = this.dados._def.extendedProps.nameFather

  }

  abrirModalCancelamento() {
    this.dialogService.open(MotivoCancelamentoComponent)
      .onClose.subscribe(reason => this.cancelarAtendimento(reason));
  }

  cancelarAtendimento(reason) {

    if (reason != null) {
      if (reason != '') {
        this.isActive = true

        let register = {
          'id': this.atendimento.id,
          'reasonCancellation': reason
        }

        this.service.cancelarAtendimento(register, (response) => {
          this.isActive = false
          this.toastrService.success('Atendimento cancelado com sucesso !!!');
          this.location.back()
        }, (message) => {
          this.isActive = false;
          this.toastrService.danger(message);
        });
      } else {
        this.toastrService.danger('Preencha o motivo de cancelamento.');
      }

    }
  }

  aprovarPagamento() {

    this.isActive = true

    this.service.aprovarPagamento(null, this.atendimento.id, (response) => {

      this.isActive = false
      this.toastrService.success('Pagamento aprovado com sucesso !!!');
      this.location.back()
    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);
    });

  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  abrirComprovante() {

    this.service.visualizarAnexo(this.atendimento.id, null, (response => {

      if (response != null) {
        const blobURL = URL.createObjectURL(this.pdfBlobConversion(response.paymentProof, 'image/jpeg'));
        const theWindow = window.open(blobURL);
        const theDoc = theWindow.document;
        const theScript = document.createElement('script');
        function injectThis() {
          window.print();
        }
        theScript.innerHTML = 'window.onload = ${injectThis.toString()};';
        theDoc.body.appendChild(theScript);
      } else {
        this.toastrService.danger('Não existe comprovante em anexo!!!');
      }

    }), (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);

    });

  }

  pdfBlobConversion(b64Data, contentType) {

    contentType = contentType || '';
    var sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    var byteCharacters = window.atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset = offset + sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });

    return blob;

  }

  abrirConsulta() {
    let rowData = [{
      tela: 'atendimento',
      rowData: this.dados._def.extendedProps.dados
    }]
    this.ref.close();
    this.router.navigateByUrl('/pages/atendimento/consulta-paciente', { state: rowData });
  }

  editarConsulta() {
    this.ref.close();
    this.router.navigateByUrl('/pages/atendimento/agendar-consulta', { state: this.dados._def.extendedProps.dados });
  }

}
