import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { AtendimentoService } from "../atendimento.service";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { MotivoCancelamentoComponent } from "./motivo-cancelamento/motivo-cancelamento.component";
import { HttpParams } from "@angular/common/http";
import * as moment from 'moment';

@Component({
  selector: 'ngx-detalhe-atendimento',
  styleUrls: ['./detalhe-atendimento.component.scss'],
  templateUrl: './detalhe-atendimento.component.html',
})
export class DetalheAtendimentoComponent implements OnInit {

  public isActive = false;
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
    status: '03 - Consulta Confirmada',
    urlCall: null,
    comprovante: null,
    especialidade: null,
    prescricao: null,
    atestado: null,
    id: null,
  };
  public showModal: boolean = false;
  public cancellationReason: string = '';
  public paciente = null;

  settings = {
    //actions: false,
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: true,
    hideSubHeader: true,
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,

    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
  };

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: AtendimentoService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private location: Location,) {
  }

  ngOnInit() {
    let data = history.state

    this.atendimento.medico = data.doctor.name
    this.atendimento.paciente = data.child != null ? data.child.name : data.user.name
    this.atendimento.nomeResponsavel = data.user.name
    this.atendimento.data = moment(data.dateService).format('DD/MM/YYYY')
    this.atendimento.horario = data.startTime.concat(' - ', data.endTime)
    this.atendimento.formaPagamento = data.typePayment
    this.atendimento.modalidade = data.typeService
    this.atendimento.urlCall = data.meetingUrl
    this.atendimento.status = data.status
    this.atendimento.especialidade = data.specialty.name
    this.atendimento.convenio = data.plan != null ? data.plan.name : null
    this.atendimento.id = data.id
    this.atendimento.comprovante = data.paymentProof

    this.paciente = data

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

  abrirConsulta() {
    let rowData = [{
      tela: 'atendimento',
      rowData: this.paciente
    }]
    this.router.navigateByUrl('/pages/atendimento/consulta-paciente', { state: rowData });
  }

  previousPage() {
    this.router.navigate(['/pages/atendimento/buscar-atendimento'])
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

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  editarConsulta() {
    this.router.navigateByUrl('/pages/atendimento/agendar-consulta', { state: this.paciente });
  }
}
