import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AtendimentoService } from "../atendimento.service";
import { EncriptyUtilService } from "../../shared/services/encripty-util.services";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { MotivoCancelamentoComponent } from "./motivo-cancelamento/motivo-cancelamento.component";
import { HttpParams } from "@angular/common/http";
import { VerComprovanteComponent } from "./ver-comprovante/ver-comprovante.component";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

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
    private activatedRouter: ActivatedRoute,
    private service: AtendimentoService,
    private encriptyService: EncriptyUtilService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private location: Location,
    private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    let data = history.state
    this.atendimento.medico = data.doctor.name
    this.atendimento.paciente = data.child != null ? data.child.name : data.user.name
    this.atendimento.nomeResponsavel = data.user.name
    this.atendimento.data = data.dateService
    this.atendimento.horario = data.startTime.concat(' - ', data.endTime)
    this.atendimento.formaPagamento = data.typePayment
    this.atendimento.modalidade = data.typeService
    this.atendimento.urlCall = data.meetingUrl
    this.atendimento.status = data.status
    this.atendimento.especialidade = data.specialty.name
    this.atendimento.convenio = data.plan != null ? data.plan.name : null
    this.atendimento.id = data.id
    this.atendimento.comprovante = data.paymentProof
  }
  abrirModalCancelamento() {
    this.dialogService.open(MotivoCancelamentoComponent)
      .onClose.subscribe(reason => this.cancelarAtendimento(reason));
  }

  cancelarAtendimento(reason) {

    if (reason != null) {
      if (reason != '') {
        this.isActive = true

        let params = new HttpParams();
        params = params.append('id', this.atendimento.id)
        params = params.append('reasonCancellation', reason)

        this.service.cancelarAtendimento(params, (response) => {

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
    this.router.navigate(['/pages/atendimento/consulta-paciente']);
  }

  previousPage() {
    this.router.navigate(['/pages/atendimento/buscar-atendimento'])
  }

  abrirComprovante() {
    const safeImageUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${this.atendimento.comprovante}`);
    this.dialogService.open(VerComprovanteComponent, {
      context: {
        imageUrl: safeImageUrl,
      },
    });
  }
  
  goToLink(url: string) {
    window.open(url, "_blank");
  }
}
