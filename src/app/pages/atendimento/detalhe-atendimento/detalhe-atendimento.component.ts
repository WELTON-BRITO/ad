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
    Nomepaciente: null,
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
    nameMother: null,
    nameFather: null,
    telefone: null,
    email: null,
  };
  public showModal: boolean = false;
  public cancellationReason: string = '';
  public paciente = null;
  public clinicaId = null;
  public listClinica = null;
  public listTipoConsulta = [];
  

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
    

    if(localStorage.getItem('detalhesData')==null){

    if (data.doctor && data.doctor.name !== undefined){

      const dataNascimento = data.child?.birthDate ?? data.user?.birthDate ?? '20240101';
      const idadePessoa = this.calcularIdade(dataNascimento) ?? null;
   
      let allData = {
        medico: data.doctor?.name ?? null,
        nomePaciente: data.child?.name ?? data.user?.name ?? null,
        nomeResponsavel: data.user?.name ?? null,
        data: moment(data.dateService).format('DD/MM/YYYY'),
        horario: data.startTime.concat(' - ', data.endTime),
        formaPagamento: data?.typePayment?? null,
        modalidade: data.typeService?? null,
        urlCall: data.meetingUrl?? null,
        status: data.status?? null,
        especialidade: data.specialty?.name ?? null,
        convenio: data.plan?.name ?? null,
        id: data.id?? null,
        comprovante: data.paymentProo?? null,
        nameFather: data.child?.nameFather ?? null,
        nameMother: data.child?.nameMother ?? null,
        telefone: data.user?.cellPhone ?? null,
        email: data.user?.emailUser ?? null,
        dateNasc: idadePessoa ?? null,
        ultimaConsulta: data.child?.dateRegister ?? null,
        doctorId: data.doctor?.id ?? null,
        userId: data.user?.id ?? null,
        idChild: data.child?.idChild ?? null,
        sexo: data.biologicalSex === 'M' ? 'Masculino' : 'Feminino' ?? null,
        tipoSanguineo: data.child?.bloodType ?? null,
    };
        
    this.paciente = allData

    this.atendimento.status = data.status?? null;

    this.saveData('detalhesData', allData);
    return this.paciente;

  }else{

    this.router.navigate(['/pages/atendimento/buscar-atendimento'])

  }
  }else{
    
    const allData = localStorage.getItem('detalhesData')

if (allData) {
  // Converta os dados de string para objeto
  const parsedData = JSON.parse(allData);

  // Preencha os cards com os dados recuperados
  this.paciente = parsedData;
}
  }
  }
      // Salva os dados no LocalStorage
      saveData(key: string, data: any): void {
        localStorage.setItem(key, JSON.stringify(data));
      }
    
      // Recupera os dados do LocalStorage
      getData(key: string): any {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : null;
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
          'id': this.paciente.id,
          'reasonCancellation': reason
        }

        this.service.cancelarAtendimento(register, (response) => {
          this.isActive = false
          this.toastrService.success('Atendimento Cancelado com Sucesso','Aditi Care!');
          this.location.back()
        }, (message) => {
          this.isActive = false;
          this.toastrService.danger(message);
        });
      } else {
        this.toastrService.danger('Preencha o Motivo de Cancelamento','Aditi Care!');
      }

    }
  }

  aprovarPagamento() {

    this.isActive = true

    this.service.aprovarPagamento(null, this.paciente.id, (response) => {

      this.isActive = false
      this.toastrService.success('Pagamento aprovado com sucesso','Aditi Care!');
      this.atendimento.status ='03 - Consulta Confirmada';

    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);
    });

  }

  abrirConsulta() {
    let data = history.state
    let rowData = [{
      tela: 'atendimento',
      rowData: data

    }]
    this.router.navigateByUrl('/pages/atendimento/consulta-paciente', { state: rowData });
  }

  previousPage() {
    this.router.navigate(['/pages/atendimento/buscar-atendimento'])
    localStorage.removeItem('detalhesData');
    localStorage.removeItem('histDetails');

  }

  abrirComprovante() {

    let blobURL: string;

    this.service.visualizarAnexo(this.paciente.id, null, (response => {
      
      if (response != null) {

        if(response.paymentProof == 'JPEG' || response.paymentProof == 'JPG' || response.paymentProof == 'PNG'){
          const blobURL = URL.createObjectURL(this.pdfBlobConversion(response.paymentProof, 'image/jpeg'));
        }
        else if (response.paymentProof=='PDF')
        {
          const blobURL = URL.createObjectURL(this.pdfBlobConversion(response.paymentProof, 'document/pdf'));
        }else {
          const blobURL = URL.createObjectURL(this.pdfBlobConversion(response.paymentProof, 'image/jpeg'));
        }

        const theWindow = window.open(blobURL);
        const theDoc = theWindow.document;
        const theScript = document.createElement('script');
        function injectThis() {
          window.print();
        }
        theScript.innerHTML = 'window.onload = ${injectThis.toString()};';
        theDoc.body.appendChild(theScript);
      } else {
        this.toastrService.warning('Este Atendimento Não Possui Anexo','Aditi Care!');
      }


    }), (error) => {
      this.isActive = false;
      this.toastrService.danger(error.message);

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
    this.router.navigateByUrl('/pages/atendimento/reagendar-atendimento', { state: this.paciente });
  }
  verificaClinica(data) {
    this.clinicaId = data;
  }

    calcularIdade(dataNascimento: string){
      const hoje = new Date();
      const nascimento = new Date(dataNascimento);
  
      const diff = hoje.getTime() - nascimento.getTime();
      const idade = new Date(diff);
  
      const anos = idade.getUTCFullYear() - 1970;
      const meses = idade.getUTCMonth();
      const dias = idade.getUTCDate() - 1;
  
      const dataCompleta = `Nasceu em ${nascimento.getFullYear()}, e Tem ${anos} anos ${meses} Meses e ${dias} Dias de Vida.`;
  
      return dataCompleta;
}
}

