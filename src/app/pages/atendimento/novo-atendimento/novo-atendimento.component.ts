import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { AtendimentoService } from '../atendimento.service';
import { deCamelCase } from '@swimlane/ngx-datatable';
import { CPFValidator } from '../../shared/validators/CPFValidator';
import * as moment from 'moment';
import { concatMapTo } from 'rxjs-compat/operator/concatMapTo';

@Component({
    selector: 'ngx-novo-atendimento',
    styleUrls: ['./novo-atendimento.component.scss'],
    templateUrl: './novo-atendimento.component.html',
})
export class NovoAtendimentoComponent {

    public formNovoAtendimento = null;
    public listMedico = null;
    public isActive = false;
    public listPagto = null;
    public listDependente = null;
    public listTipoEspecialidade = null;
    public listTipoProcedimento = null;
    public listTempoAtendimento  = null;
    public tipoProcedimento = null;
    public listConvenio = null;
    public isConvenio = false;
    public isPagto = false;
    public isDependente = false;
    public tamanho: number = 2000;
    public msgErro = 'CPF inválido!!!';
    public showMsgErro = false;
    public doctorId = null;
    public clinicId = null;
    public userId = null;
    public childId = null;
    public specialtyId = null;
    public listTipoConsulta = [];
    public rowData = [];
    public tipoCard = [];
    public isHorario = false;
    public isConfAtendimento = false;
    public dadosHorario = null;
    public isDadosAtendimento = false
    public tipoPagto = null;
    public dependente = null;
    public detalhes = 'Consulta de retorno';
    public retorno = null;
    public isEncaixe = false;
    public isEncaixe1 = false;
    public optEncaixe = null;
    public telefoneResponsavel = null
    public emailResponsavel = null
    public optPart = null;
    public exibirDivProcedimento: boolean = false;
    public bloqueioSave: boolean = false;
    public origem: null;



    public tipoCardEncaixe: any[] = [{
        id: '',
        horaInicio: '',
        horaFim: ''
    }];
    public encaixe = false;
    public dateEncaixe = null;
    public horarioSelecionado: string;

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private toastrService: NbToastrService,
        private service: AtendimentoService) {

        this.listTipoConsulta = [
        
        
            {
            id: 1,
            descricao: "01 - Presencial"
          },
          {
            id: 3,
            descricao: "02 - Presencial Emergencial"
          },
          {
            id: 2,
            descricao: "03 - Por Video Chamada"
          },
          {
            id: 5,
            descricao: "04 - Video Chamada Emergencial"
          },
          {
            id: 4,
            descricao: "05 - Em Casa"
          },
          {
            id: 6,
            descricao: "06 - Procedimentos"
          }
    ];

    this.listTempoAtendimento = [
        
        
        {
        id:  15,
        name: "15 Minutos"
      },
      {
        id: 30,
        name: "30 Minutos"
      },
      {
        id: 15,
        name: "45 Minutos"
      },
      {
        id: 60,
        name: "60 Minutos"
      },
      {
        id: 90,
        name: "90 Minutos"
      },
      {
        id: 120,
        name: "120 Minutos"
      }
];

    }

    ngOnInit() {

        let data = history.state
        this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));
        this.verificaMedico(this.listMedico[0].id);
        this.pagamento();
        this.formNovoAtendimento = this.formBuilder.group({
            medico: [this.listMedico[0]],
            cpf: [null],
            dataInicio: [null],
            consultaParticular: [null],
            consultaDependente: [null],
            formaPagto: [null],
            formaConvenio: [null],
            incluirDep: [null],
            consPagto: [null],
            nomeResponsavel: [{ value: null, disabled: true }],
            tipoConsulta: [null],
            tipoEspecialidade: [null],
            tipoProcedimento: [null],
            optEncaixe: null,
            telefoneResponsavel: [{ value: null, disabled: true }],
            emailResponsavel: [{ value: null, disabled: true }],
            optPart: null,
            listTempoAtendimento: [null],
            tempoAtendimento: null,
            horarioSelected: null,
          });
          
        this.formNovoAtendimento.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });
        this.formNovoAtendimento.controls['tipoConsulta'].setValue(this.listTipoConsulta[0].id, { onlySelf: true });

        this.tipoCardEncaixe = []; 

        if(data.data !=null){
            this.origem = data?.location
            this.formNovoAtendimento.controls['dataInicio'].setValue(this.formatarData(data.data), { onlySelf: true });
            this.formNovoAtendimento.controls['tipoConsulta'].setValue(1, { onlySelf: true });
           // this.formNovoAtendimento.controls['tipoEspecialidade'].setValue(1, { onlySelf: true });
            this.formNovoAtendimento.controls['optEncaixe'].setValue('N', { onlySelf: true });
            this.formNovoAtendimento.controls['horarioSelected'].setValue(data.data + ' - ' + data.horario, { onlySelf: true });
            this.horarioSelecionado = (data.data + ' - ' + data.horario);
            document.getElementById('dataInicio').setAttribute('disabled', 'true');

            this.dadosHorario = data;
            this.isConfAtendimento = true;   
            this.encaixe=true;    

    }

    }

    pagamento() {
        this.isActive = true
        this.service.buscaPagamentos(null, (response) => {

            this.listPagto = response
            this.isActive = false

        }, (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message);
        });

    }

    buscaConvenio(data) {

        if (data == 'S') {
            this.isConvenio = false;
            this.isPagto = true;
        } else {
            this.isActive = true;
            this.isConvenio = true;
            this.isPagto = false;

            this.service.buscaConvenio(this.doctorId, null, (response) => {
                this.isActive = false;
                if (response.length === 0){
                this.toastrService.danger('Este médico não aceita Convênio','Aditi Care');
                this.optPart = true;
                document.getElementById('radioSS').setAttribute('checked', 'true');
                const radioSS = document.getElementById('radioSS') as HTMLInputElement;
                radioSS.checked = true;
                this.isConvenio = false;
                this.isPagto = true;
            }else{
                    this.listConvenio = response;
                }
        
            }, (error) => {
                this.toastrService.danger(error.message);
            });
        }
    }

    buscaDependente(data) {

        if (data != null) {

            let params = new HttpParams();

            params = params.append('userId', data)

            this.isActive = true;

            this.service.buscaDependente(params, (response) => {

                if (response.length > 0) {
                    this.listDependente = response
                   // this.childId = response[0].idChild
                }

                this.isActive = false;
            }, (error) => {
                this.isActive = false;
                this.toastrService.danger(error.error.message);
            });

        } else {
            this.toastrService.danger('O CPF deve ser Informado','Aditi Care');
        }


    }

    limpaForm() {

        this.formNovoAtendimento = this.formBuilder.group({
            medico: [null],
            cpf: [null],
            dataInicio: [null],
            consultaParticular: [null],
            consultaDependente: [null],
            formaPagto: [null],
            formaConvenio: [null],
            incluirDep: [null],
            consPagto: [null],
            nomeResponsavel: [null],
            tipoConsulta: [null],
            tipoEspecialidade: [null],
            telefoneResponsavel:null,
            emailResponsavel:null,
        })

    }

    consultaDependente(data) {

        console.log(data)

        if (this.listDependente == null) {
            this.toastrService.danger('Este Usuário Não Possui Dependentes','Aditi Care');
            this.isDependente = false;
        } else {
            if (data == 'S') {
                this.isDependente = true;
            } else {
                this.isDependente = false;
            }

        }

    }

    consultaParticular(data) {

        if (data == 'S') {
            this.isConvenio = false;
            this.isPagto = true;
        } else {
            this.isConvenio = true;
            this.isPagto = false;
        }
    }

 formatarData(dataString) {
        // Verifica se a string está no formato correto (dia/mês/ano)
        const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        const match = dataString.match(regex);
    
        if (!match) {
            // A string não está no formato esperado
            console.log("Formato de data inválido.");
            return dataString; // Retorna a mesma string
        }
    
        // Extrai os valores do dia, mês e ano
        const dia = match[1];
        const mes = match[2].padStart(2, "0"); // Garante que o mês tenha 2 dígitos
        const ano = match[3];
    
        // Monta a nova string no formato desejado
        const novaData = `${ano}-${mes}-${dia}`;
        return novaData;
    }
    
    

    qdadeCaracteres() {

        let inpuBox = document.querySelector(".input-box"),
            textArea = inpuBox.querySelector("textarea");
        var caracteresRestantes = 2000;

        textArea.addEventListener("keyup", () => {

            let valLenght = textArea.value.length;
            this.tamanho = caracteresRestantes - valLenght;
            valLenght < 30
                ? inpuBox.classList.add("error")
                : inpuBox.classList.remove("error");

        });
    }

    pesquisaPaciente(data) {

        if (data.cpf != null) {

            this.isActive = true;

            this.service.buscaPaciente(null, data.cpf, (response) => {
                
                if(response == null){
                    this.isActive = false;
                    this.toastrService.warning('O CPF Informado Não Foi Encontrado','Aditi Care');
                }
                else{ 
                    this.isActive = false;
                    this.userId = response.id
                    this.isDadosAtendimento=true;
                    this.formNovoAtendimento.controls['nomeResponsavel'].setValue(response.name);
                    this.formNovoAtendimento.controls['telefoneResponsavel'].setValue(response.cellPhone);
                    this.formNovoAtendimento.controls['emailResponsavel'].setValue(response.emailUser);
                    this.buscaDependente(this.userId)
                    this.isConvenio =false;}

               
            }, (error) => {
                this.isActive = false;
                this.toastrService.danger(error.message);
            });

        } else {
            this.toastrService.danger('O campo CPF deve ser Preenchido','Aditi Care');
        }

    }

    isValidCpf(data) {

        if(this.validaCampo(data)){

        this.listDependente = [];
        this.isDependente = false;

        if (!CPFValidator.isValidCPF(data.cpf)) {
            this.isDadosAtendimento = false;
            this.formNovoAtendimento.controls['nomeResponsavel'].setValue(null);
            this.toastrService.warning('O campo CPF Não é valido!','Aditi Care');
            return false;
        }
        this.pesquisaPaciente(data)
        return true;
    }
    }

    consultaPaga(data) {

        if (data == "S") {
            this.tipoPagto = true
        } else {
            this.tipoPagto = false
        }
        this.bloqueioSave= true;

    }

    

    salvar(data) {

        this.bloqueioSave= false;

        if (this.specialtyId == null) {
            this.toastrService.warning('O Tipo da Especialidade deve ser Informado','Aditi Care');
            this.bloqueioSave= true;

        }

        if (this.dadosHorario.horario === undefined) {
            var startTime = this.tipoCardEncaixe[0].horaInicio
            var endTime = this.tipoCardEncaixe[0].horaFim
            this.dateEncaixe = moment(data.dataInicio).format('DD/MM/YYYY')
        } else {
            var startTime = this.dadosHorario.horario.slice(0, 5)
            var endTime = this.dadosHorario.horario.slice(8)
        }

        this.clinicId = localStorage.getItem('bway-entityId');
       
        if(data.horarioSelected !== undefined)
        {
        const dataTemp = data.horarioSelected.split(" ");
        var dataCompleta = dataTemp[0]; // Acessa a primeira parte do array
            }else{
        var  dataCompleta=(data.dataInicio)
            }

        let register = {

            doctorId: this.doctorId,
            clinicId: this.clinicId,
            userId: this.userId,
            childId: this.childId,
            dateService:this.formatarData(dataCompleta),
            startTime: startTime.trim(),
            endTime: endTime.trim(),
            healthPlanId: data.formaConvenio,
            typePaymentId: data.formaPagto ?? 1,
            typeServiceId: data.tipoConsulta ?? 1,
            meetingUrl: this.dadosHorario.data === undefined ? this.dateEncaixe.concat(' - ', this.userId, ' - ', startTime, ' - ', this.doctorId) : this.dadosHorario.data.concat(' - ', this.userId, ' - ', startTime, ' - ', this.doctorId),
            specialtyId: this.specialtyId ?? 1,
            paymentInCreation: this.tipoPagto ?? false,
            isReturn: this.retorno ?? false ,
            dontCheckAvailable: this.encaixe ?? true,
            procedureId: this.tipoProcedimento,
            customDuration: data.tempoAtendimento,
        }

        this.isActive = true;
        this.service.salvarAgendamento(register, (response => {
            this.isActive = false;
            this.toastrService.success('Cadastrado Realizado com Sucesso','Aditi Care!');
            localStorage.removeItem('meuCardData'); //garante que o cache foi apagado das telas posteriores
            localStorage.removeItem('googleData'); //garante que o cache foi apagado das telas posteriores
            this.limpaForm();
            this.previousPage();
        }), (error) => {
            this.bloqueioSave= true;
            this.isActive = false;
            this.toastrService.danger(error.message);

        });

    }

    

    verificaMedico(data) {

        for (var i = 0; i < this.listMedico.length; i++) {

            if (data == this.listMedico[i].id) {
                this.doctorId = this.listMedico[i].id
            }
        }

        this.verificaEspecialidade(this.doctorId);
        this.verificaprocedimento(this.doctorId);

        // this.buscaConvenio(this.doctorId);
    }

    verificaDependente(data) {

        for (var i = 0; i < this.listDependente.length; i++) {

            if (data == this.listDependente[i].idChild) {
                this.childId = this.listDependente[i].idChild
            }
        }

    }

    especialidade(data) {

        for (var i = 0; i < this.listTipoEspecialidade.length; i++) {

            if (data == this.listTipoEspecialidade[i].id) {
                this.specialtyId = this.listTipoEspecialidade[i].id
            }
        }
    }

    verificaEspecialidade(data) {

        this.service.verificaEspecialidade(data, null, (response => {

            this.listTipoEspecialidade = response
          //  this.formNovoAtendimento.controls['tipoEspecialidade'].setValue(this.listTipoEspecialidade[0].id, { onlySelf: true });
           // this.specialtyId = this.listTipoEspecialidade[0].id;

        }), (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message);
        });

    }

    ValidaTipoConsulta(data) {
                if (data == 6) {
                    this.exibirDivProcedimento = true;
            }else {
                this.exibirDivProcedimento = false;

            }

    }

    SetaProcedimento(data) {

        for (var i = 0; i < this.listTipoProcedimento.length; i++) {

            if (data == this.listTipoProcedimento[i].id) {
                this.tipoProcedimento = this.listTipoProcedimento[i].id
        }
    }
    }

    verificaprocedimento(data) {
        this.service.verificaProcedimento(data, null, (response => {


            this.listTipoProcedimento = response

        }), (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message);

        });

    }

    tempoAtendimento(data){

        for (var i = 0; i < this.listTempoAtendimento.length; i++) {

            if (data == this.listTempoAtendimento[i].id) {
                this.tempoAtendimento = this.listTempoAtendimento[i].id
            }
        }


    }

    pesquisarConsulta(data) {

        let date = new Date(data.dataInicio)
        date.setDate(date.getDate() + 6)

        this.tipoCard = [];
        this.isConfAtendimento = false;

        if (this.validaCampo(data)) {

            this.isActive = true
            let params = new HttpParams();
            params = params.append('doctorId', data.medico)
            params = params.append('startDate', data.dataInicio)
            params = params.append('endDate', moment(date).format('YYYY-MM-DD'))
            params = params.append('typeServiceId', data.tipoConsulta)
            
            if (data.tipoConsulta == 6 && data.tipoProcedimento !== null) {
                params = params.append('procedureId', data.tipoProcedimento)
            }
            if (data.tempoAtendimento !== null && data.tempoAtendimento !== "null") {
                params = params.append('duration', data.tempoAtendimento);
            }
            

            this.service.buscaHorario(params, (response) => {

                this.tipoCard = response.times;
                this.tipoCard = this.tipoCard.filter(function (item) {
                return true;
                });
                this.tipoCard = this.tipoCard.map(data => {
                    return {
                        data: data.date,
                        horario: data.startTime.concat(' - ', data.endTime),
                        statusCard: data.status,
                        nomePaciente: data.status
                    }
                })

                this.isActive = false
                this.isHorario = true;

            }, (error) => {
                this.isActive = false;
                this.toastrService.danger(error);
            });
        }
    }

    validaCampo(data) {

        if (data.medico == null) {
            this.toastrService.warning('O campo Médico é Obrigatório','Aditi Care');
            return false
        }
        if (data.tipoConsulta == null) {
            this.toastrService.warning('O campo tipo consulta é obrigatório','Aditi Care');
            return false
        }
        if (data.dataInicio == null) {
            this.toastrService.warning('A Data Deve ser Informada','Aditi Care');
            return false
        }
        if (data.tipoConsulta == 6 && data.tipoProcedimento == null) {
            this.toastrService.warning('O Tipo do Procedimento deve ser Informado','Aditi Care');
            return false
        }
        if (data.tipoEspecialidade == null) {
            this.toastrService.warning('O Tipo da Especialidade deve ser Informado','Aditi Care');
            return false
        }

        return true
    }

    confHorario(data, element) {

        this.formNovoAtendimento.controls['horarioSelected'].setValue((data.data + " - " +  data.horario));

        this.tipoCard = [];
        this.dadosHorario = data;
        if ((data.horaInicio != null) && (data.horaFim != null) && (element.dataInicio != null)) {
            this.isHorario = false;
               this.isConfAtendimento = true;
        }
        if ((data.data != null) && (data.horario != null) && (element.dataInicio != null)) {
            this.isHorario = false;
               this.isConfAtendimento = true;
        }

    }

    consultaRetorno(data) {

        if (data === 'S') {
            document.getElementById('consPagto').setAttribute('disabled', 'true');
            document.getElementById('radioSim').setAttribute('checked', 'true');
            document.getElementById('radioNao').setAttribute('disabled', 'true');
            this.formNovoAtendimento.controls['consPagto'].setValue(this.detalhes);
            this.retorno = true
        } else {
            document.getElementById('consPagto').removeAttribute('disabled');
            document.getElementById('radioNao').removeAttribute('disabled');
            document.getElementById('radioSim').removeAttribute('checked');
            this.formNovoAtendimento.controls['consPagto'].setValue(null);
            this.retorno = false
        }
    }

    previousPage() {

        if (this.origem === 'agendaGoogle') {
            this.router.navigate(['/pages/visualizar-agenda/agenda'])

        }else{
            this.router.navigate(['/pages/atendimento/buscar-atendimento'])

        }
    }

    buscarEncaixe(data,form) {

        this.isConfAtendimento = false;

        if(form.tipoConsulta == null){

            this.toastrService.warning('Por favor Informe o Tipo de Consulta Desejada','Aditi Care');
            this.formNovoAtendimento.controls['optEncaixe'].setValue(null);
                }
        else if(form.tipoEspecialidade == null){

            this.toastrService.warning('Por favor Informe a Especialidade Desejada','Aditi Care');
            this.formNovoAtendimento.controls['optEncaixe'].setValue(null);

         } else if(form.tipoConsulta == 6 && form.tipoProcedimento == null) {
            this.toastrService.warning('Por favor Informe o Procedimento Desejado','Aditi Care');
        }
         else{

            if (data === 'S') {
                this.isHorario = false;
                this.isEncaixe = false;
                this.isEncaixe1 = true;
                this.encaixe = true;
                if (this.tipoCardEncaixe.length === 0) {
                    this.tipoCardEncaixe.push({
                        id: this.tipoCardEncaixe.length,
                    })
                }
            } else {
                this.tipoCardEncaixe.splice(null);
                this.isEncaixe = true;
                this.isEncaixe1 = false;
                this.encaixe = false;
                this.isConfAtendimento = false;
            }
        }
     }
      

    pesquisarHorario(data,form) {

        this.dadosHorario = form;

        this.isConfAtendimento = false;
        if (data.dataInicio == null ) {
            this.toastrService.warning('Por favor Informa a Data Desejada!','Aditi Care');
        } 
        else if(this.dadosHorario.horaInicio == null || this.dadosHorario.horaFim == null ){

            this.toastrService.warning('Por favor Informa o Horário do Encaixe Desejado!','Aditi Care');

        } else {

            this.isActive = true
            let params = new HttpParams();
            params = params.append('doctorId', data.medico)
            params = params.append('dateService', moment(data.dataInicio).format('YYYY-MM-DD'))
            params = params.append('startTime', this.dadosHorario.horaInicio)
            params = params.append('endTime', this.dadosHorario.horaFim)

            if(data.tipoConsulta == 6 && data.tipoProcedimento != null){
                params = params.append('procedureId', this.tipoProcedimento)
            }

            this.service.timeAvailable(params, (response) => {
                this.isConfAtendimento = false;
                this.isActive = false
                if(response.value ==true){
                    this.isConfAtendimento = true;
                    this.toastrService.success('O Horário Informado Está Disponível','Aditi Care');
                    this.formNovoAtendimento.controls['horarioSelected'].setValue((data.dataInicio + " - " +this.dadosHorario.horaInicio + " - " + this.dadosHorario.horaFim ));
                }
                else{
                    this.isConfAtendimento = false;
                    this.toastrService.warning('O Horário Informado não Está Disponível','Aditi Care');

                }
            }, (error) => {
                this.toastrService.danger(error.message);
            });

        }
    }

}
