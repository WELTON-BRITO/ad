import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { AtendimentoService } from '../atendimento.service';
import * as moment from 'moment';
import { Observable, Subscriber } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';


declare var $: any;
@Component({
    selector: 'ngx-consulta-paciente',
    styleUrls: ['./consulta-paciente.component.scss'],
    templateUrl: './consulta-paciente.component.html',
})

export class ConsultaPacienteComponent implements OnDestroy {


    @ViewChild("inputFileReceita",)
    private inputFileReceita: ElementRef;

    @ViewChild("inputFileAtestado",)
    private inputFileAtestado: ElementRef;

    @ViewChild('prescricaoMedica') prescricaoMedica: ElementRef;

    public formConsultaPaciente = null;
    public isActive = false;
    public isDetalhes = false;
    public isHistorico = false;
    public isAtestado = false;
    public isReceita = false;
    public tamInterno: number = 20000;
    public tamCliente: number = 20000;
    public tamMedica: number = 20000;
    public tamExame: number = 20000;
    public bloqueioSave: boolean = false;
    public isSaving: boolean = false;
    public checkedConsulta: boolean = false;
    public isretorno: boolean = false;
    public hasSpecial: boolean = false;
    public isEncaixe1: boolean = false;
    public isEncaixe2: boolean = false;    
    public html_string: any ;
    public isLoader: boolean = false;
    public isCollapsed = false;
    public iconeAtivo: string = '';
    public tipoCard = [];
    public isHorario = false;
    public isConfAtendimento = false;
    public dadosHorario = null;
    public horarioSelecionado: string;
    public clinicId = null;
    public doctorId = null;
    public agendado = false;
    public avatar = "assets/images/avatar.png";
    public tipoCardEncaixe: any[] = [{
        id: '',
        horaInicio: '',
        horaFim: ''
    }];




    public file: any;
    formData: FormData;
    public atendimento = {
        id: null,
        doctorId: null,
        nomePaciente: null,
        dateNasc: null,
        sexo: null,
        especialidade: null,
        tipoSanguineo: null,
        ultimaConsulta: null,
        userId: null,
        idChild: null,
        status: null,
        data: null,
        horario: null,
        nameMother: null,
        nameFather: null,
        modalidade: null,
        telefone: null,
        email: null,
        patchPaciente: false,
        planId: null,
        procedureId: null,
        specialtyId: null,
        typeServiceId: null,
        avatar: null,
        findhistorico: null,
            };
    public anexoAtestado = null;
    public anexoReceita = null;
    public rowData = null;
    public endDate = new Date()
    public startDate = new Date();
    public historico = null

    
    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private toastrService: NbToastrService,
        private sanitizer: DomSanitizer, private elRef: ElementRef, private cdRef: ChangeDetectorRef,
        private service: AtendimentoService) {
    }

    ngOnDestroy() { }
    ngOnInit() {

        this.startDate.setFullYear(this.startDate.getFullYear() - 5);

        this.hasSpecial=false;

        this.formConsultaPaciente = this.formBuilder.group({
            detalhesCliente: [null],
            detalhesInterno: [null],
            tempoRetorno: [null],
            horarioSelected: null,
            agendarRetorno: null,
            altura: [null],
            peso: [null],
            circCabeca: [null],
            circAbdomen: [null],
            urlReceita: [null],
            urlAtestado: [null],
            nome: [null],
            atestado: [null],
            receita: [null],
            prescricaoMedica: [null],
            pedidoExame: [null],
            urlExame: [null],
            imc: [null],
            id: null,
            patchPaciente: false, 
            planId: null,
            procedureId: null,
            specialtyId: null,
            typeServiceId: null,
            findhistorico: null,
        })


         var data = history.state

         this.historico = data;

        if(localStorage.getItem('detalhesData')!==null){
            
            const allData = localStorage.getItem('detalhesData')

            if (allData) {
              // Converta os dados de string para objeto
              const parsedData = JSON.parse(allData);
              this.atendimento = parsedData;
            }

    }else if(data[0].tela =='atendimento' && data[0].rowData.userName!=null){

        const dataNascimento = data[0].rowData.childBirthDate ?? data[0].rowData.BirthDate ?? '2024-01-01'; // to-do incluir campo de aniversario do usuario no retorno
        const idadePessoa = this.calcularIdade(dataNascimento) ?? null;
        let allData = {
          medico: data[0].rowData.doctorName ?? null,
          nomePaciente: data[0].rowData.childName ?? data[0].rowData.userName ?? null,
          nomeResponsavel: data[0].rowData.userName ?? null,
          data: moment(data[0].rowData.dateService).format('DD/MM/YYYY'),
          horario: data[0].rowData.startTime.concat(' - ', data[0].rowData.endTime),
          formaPagamento: data[0]?.rowData.typePayment?? null,
          modalidade: data[0].rowData.typeServiceName?? null,
          urlCall: data[0].rowData.meetingUrl?? null,
          status: data[0].rowData.status?? null,
          especialidade: data[0].rowData.specialtyName ?? null,
          convenio: data[0].rowData.planName ?? null,
          id: data[0].rowData.id?? null,
          comprovante: data[0].rowData.paymentProof?? null,
          nameFather: data[0].rowData.childFather ?? null,
          nameMother: data[0].rowData.childMother ?? null,
          telefone: data[0].rowData.userPhone ?? null,
          email: data[0].rowData.userEmail ?? null,
          dateNasc: idadePessoa ?? null,
          ultimaConsulta: data[0].rowData.childDateRegister ?? null,
          doctorId: data[0].rowData.doctorId ?? null,
          userId: data[0].rowData.userId ?? null,
          idChild: data[0].rowData.childId ?? null,
          sexo: data[0].rowData.childBiologicalSex === 'M' ? 'Masculino' : 'Feminino' ?? null,
          tipoSanguineo: data[0].rowData.childBloodType ?? null,
          patchPaciente: false,
          planId: data[0].rowData.planId,
          procedureId: data[0].rowData.procedureId,
          specialtyId: data[0].rowData.specialtyId,
          typeServiceId: data[0].rowData.typeServiceId,
          avatar: data[0].rowData.avatarChild ?? data[0].rowData.avatar ?? this.avatar,
          findhistorico: false

      };
           
      this.atendimento = allData;

      this.atendimento.status = data[0].rowData.status?? null;
  
      this.saveData('detalhesData', allData);
    }
    else{
        this.router.navigate(['/pages/atendimento/buscar-atendimento'])

    }

    }

    toggleCollapseheader(elementId: string) {
        const content = document.getElementById(elementId);
        if (content) { // Verifica se o elemento existe
          if (content.classList.contains('collapsed')) {
            content.classList.remove('collapsed');
          } else {
            content.classList.add('collapsed');
          }
        } else {
          console.error(`Elemento com ID '${elementId}' não foi encontrado.`);
        }
      }
      

    toggleCollapse(textareaId: string) {
        const textarea = document.getElementById(textareaId);
        if (textarea.style.height !== '0px' && textarea.style.height !== '') {
          textarea.style.height = '0px'; // Colapsa o textarea
        } else {
          textarea.style.height = ''; // Remove o estilo de altura para expandir
          textarea.style.overflow = 'hidden'; // Esconde o overflow durante a transição
          textarea.style.height = textarea.scrollHeight + 'px'; // Define a altura para o scrollHeight do textarea
          // Remove o estilo de overflow após a transição (opcional)
          setTimeout(() => {
            textarea.style.overflow = '';
          }, 350); // Assumindo que a duração da transição é 350ms
        }
      }

      pesquisarHorario(data,form) {

        this.dadosHorario = form;

        if(data.tempoRetorno == null ){
            this.toastrService.danger('O Prazo de Retorno Não Foi Informado','Aditi Care');
            this.fetchData(false)

            return false;
        }

        let tempo_retorno = this.processa_valores(data.tempoRetorno);

            // Verifica se 'tempo_retorno' é um número e converte se necessário
            tempo_retorno = Number(tempo_retorno);

            if (!isNaN(tempo_retorno)) {
            var dataHora = new Date();

            // Adiciona 'tempo_retorno' dias à data atual
            dataHora.setDate(dataHora.getDate() + tempo_retorno);

            // Cria 'dateEnd' como uma nova data baseada em 'dataHora'
            var dateEnd = new Date(dataHora);

            // Adiciona 7 dias a 'dateEnd'
            dateEnd.setDate(dateEnd.getDate() + 7);

            // Formata a data para 'YYYY-MM-DD'
            const dataFormatada = dateEnd.toISOString().split('T')[0];
            } else {
                this.toastrService.danger('O Prazo de Retorno não é um Numero Válido','Aditi Care');
                this.fetchData(false)

                return false;
            }

        this.isConfAtendimento = false;

        if (dataHora == null ) {
            this.toastrService.warning('Por favor Informa a Data Desejada!','Aditi Care');
        } 
        else if(this.dadosHorario.horaInicio == null || this.dadosHorario.horaFim == null ){

            this.toastrService.warning('Por favor Informa o Horário do Encaixe Desejado!','Aditi Care');

        } else {

            this.isActive = true
            let params = new HttpParams();
            params = params.append('doctorId', this.atendimento.doctorId)
            params = params.append('dateService', moment(dataHora).format('YYYY-MM-DD'))
            params = params.append('startTime', this.dadosHorario.horaInicio)
            params = params.append('endTime', this.dadosHorario.horaFim)

            this.service.timeAvailable(params, (response) => {
                this.isConfAtendimento = false;
                this.isActive = false
                if(response.value ==true){
                    this.isConfAtendimento = true;
                    this.toastrService.success('O Horário Informado Está Disponível','Aditi Care');
                    this.isEncaixe2 = true;
                    this.formConsultaPaciente.controls['horarioSelected'].setValue((moment(dataHora).format('YYYY-MM-DD') + " - " +this.dadosHorario.horaInicio + " - " + this.dadosHorario.horaFim));
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

      
      agendarencaixe(data, form){

        if(data==='N'){

            this.isEncaixe1 = false;
            this.isHorario = false;
            this.isEncaixe2 = false;


            this.fetchData(true)

            let tempo_retorno = this.processa_valores(form.tempoRetorno);

            // Verifica se 'tempo_retorno' é um número e converte se necessário
            tempo_retorno = Number(tempo_retorno);

            if (!isNaN(tempo_retorno)) {
            var dataHora = new Date();

            // Adiciona 'tempo_retorno' dias à data atual
            dataHora.setDate(dataHora.getDate() + tempo_retorno);

            // Cria 'dateEnd' como uma nova data baseada em 'dataHora'
            var dateEnd = new Date(dataHora);

            // Adiciona 7 dias a 'dateEnd'
            dateEnd.setDate(dateEnd.getDate() + 7);

            // Formata a data para 'YYYY-MM-DD'
            const dataFormatada = dateEnd.toISOString().split('T')[0];
            } else {
                this.toastrService.danger('O Prazo de Retorno não é um Numero Válido','Aditi Care');
                this.fetchData(false)

                return false;
            }
           
            this.isActive = true
            
            let params = new HttpParams();
            params = params.append('doctorId', this.atendimento.doctorId)
            params = params.append('startDate', moment(dataHora).format('YYYY-MM-DD'))
            params = params.append('endDate', moment(dateEnd).format('YYYY-MM-DD'))
            params = params.append('typeServiceId',this.atendimento.typeServiceId)
            
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
                this.fetchData(false)


            }, (error) => {
                this.isActive = false;
                this.fetchData(false)

                this.toastrService.danger(error,'Aditi Care');
            });                   
        }else{
            this.isEncaixe1 = true;
            this.isHorario = false;
        }
        
      }
      confHorario(data, element) {

        if (this.formConsultaPaciente.get('horarioSelected')) {

        this.formConsultaPaciente.controls['horarioSelected'].setValue((data.data + " - " + data.horario));

        this.tipoCard = [];
        this.dadosHorario = data;
        this.isHorario = false;
        this.isConfAtendimento = true;
    } else {
        console.error('O controle horarioSelected não foi encontrado no formulário.');
      }

    }

    limpaForm() {

        this.formConsultaPaciente = this.formBuilder.group({
            detalhesCliente: [null],
            detalhesInterno: [null],
            tempoRetorno: [null],
            altura: [null],
            peso: [null],
            circCabeca: [null],
            circAbdomen: [null],
            urlReceita: [null],
            urlAtestado: [null],
            nome: [null],
            atestado: [null],
            receita: [null],
            prescricaoMedica: [null],
            pedidoExame: [null],
            urlExame: [null],
            imc:[null],
            horarioSelected:[null],
            
        })
        this.tamMedica = 20000;
        this.tamInterno = 20000;
        this.tamCliente = 20000;
        this.tamExame = 20000;
    }

    detalhesConsulta() {
        this.isDetalhes = true;
        this.isHistorico = false;
        this.isAtestado = true;
        this.isReceita = true;
        this.bloqueioSave= true;
        this.limpaForm()

        this.iconeAtivo = 'atendimento';
        

        if(localStorage.getItem('draftAtendimento') !== null)
        {

            const allData = localStorage.getItem('draftAtendimento')
                
            if (allData) {
              // Converta os dados de string para objeto
              const parsedData = JSON.parse(allData);
              this.formConsultaPaciente.controls['detalhesCliente'].setValue(this.decodeHexadecimalString(parsedData.detalhesCliente ?? null));
              this.formConsultaPaciente.controls['prescricaoMedica'].setValue(this.decodeHexadecimalString(parsedData?.prescricaoMedica ?? null));
              this.formConsultaPaciente.controls['detalhesInterno'].setValue(this.decodeHexadecimalString(parsedData?.detalhesInterno ?? null));
              this.formConsultaPaciente.controls['tempoRetorno'].setValue(parsedData?.tempoRetorno ?? null);
              this.formConsultaPaciente.controls['altura'].setValue(parsedData?.altura ?? null);
              this.formConsultaPaciente.controls['peso'].setValue(parsedData?.peso ?? null);
              this.formConsultaPaciente.controls['circCabeca'].setValue(parsedData?.circCabeca ?? null);
              this.formConsultaPaciente.controls['circAbdomen'].setValue(parsedData?.circAbdomen ?? null);
              this.formConsultaPaciente.controls['urlReceita'].setValue(parsedData?.urlReceita ?? null);
              this.formConsultaPaciente.controls['urlAtestado'].setValue(parsedData?.urlAtestado ?? null);
              this.formConsultaPaciente.controls['prescricaoMedica'].setValue(this.decodeHexadecimalString(parsedData?.prescricaoMedica ?? null));
              this.formConsultaPaciente.controls['pedidoExame'].setValue(this.decodeHexadecimalString(parsedData?.pedidoExame ?? null));
              this.formConsultaPaciente.controls['urlExame'].setValue(parsedData?.urlExame ?? null);

            }
        }
    }

    formatDate(dateString) {
        const parts = dateString.split('/');
        const year = parts[2];
        const month = parts[1].padStart(2, '0');
        const day = parts[0].padStart(2, '0');
        return `${year}/${month}/${day}`;
    }

    consultaHistorico(checked) {
        this.isDetalhes = false;
        this.isHistorico = true;
        this.isAtestado = false;
        this.isReceita = false;

        if (checked) {
            this.iconeAtivo = 'historico';
          }

        this.fetchData(true)


    if (localStorage.getItem('histDetails') ===null  || checked==true || localStorage.getItem('histDetails') ==='') {



        let params = new HttpParams();
        params = params.append('doctorId', this.atendimento.doctorId);
        params = params.append('userId', this.atendimento.userId);
        if(this.atendimento.idChild!==null){
            params = params.append('childId', this.atendimento.idChild);
        }
        params = params.append('startDate', moment(this.startDate).format('YYYY/MM/DD'));
       // params = params.append('endDate',this.formatDate(this.atendimento.data));       
        params = params.append('statusIds', '8'); // Use a string para o statusId
    
        this.isActive = true;
        let allData = []; // Crie uma variável vazia para armazenar os dados
        this.service.buscaAtendimentos(params, (response) => {
            response.forEach(data => {
                allData.push({
                    name: data.doctorName,
                    birthDate: moment(data.childBirthDate).format('DD/MM/YYYY') ?? moment(data.childBirthDate).format('DD/MM/YYYY'),
                    id: data.id,
                    dateService: data.dateService,
                    horario: data.startTime +" - "+ data.endTime,
                    typeService: data.typeServiceName,
                    cellPhoneUser: data.userPhone,
                    emailUser:data.userEmail,
                    federalIdUser: data.userFederalId,
                    NameResponse: data.userName
                });
            });

            if (allData.length === 0) {
                this.toastrService.warning("Não Foram Encontradas Consultas Para Este Paciente.", 'Aditi Care');
                localStorage.removeItem('histDetails');
                this.isActive = false;
                this.rowData = null;

            }else{

                this.saveData('histDetails', allData);
                this.isActive = false;
                this.rowData = allData;
            }

            this.fetchData(false)

    

        }, (error) => {
            this.isActive = false;
            if (error && error.status === 400) {
                this.toastrService.warning("Não Foram Encontradas Consultas Para Este Paciente.", 'Aditi Care');
                this.fetchData(false)

            }
        });
            }else {
                const allData = localStorage.getItem('histDetails')
                
                if (allData) {
                  // Converta os dados de string para objeto
                  const parsedData = JSON.parse(allData);
                
                  // Preencha os cards com os dados recuperados
                  this.rowData = parsedData;
                }
                this.fetchData(false)

                  }
    }
    
    salvareContinuar(data){

        this.fetchData(true)

        this.saveData('draftAtendimento', data);

        this.toastrService.success('Rascunho Salvo com Sucesso', 'Aditi Care!');

        this.fetchData(false);

        this.isActive = false;



    }

    caracteresInterno() {

        let inpuBox = document.querySelector(".input-box"),
            textArea = inpuBox.querySelector("textarea");
        var caracteresRestantes = this.tamInterno;

        textArea.addEventListener("keyup", () => {

            let valLenght = textArea.value.length;
            this.tamInterno = caracteresRestantes - valLenght;
            valLenght < 30
                ? inpuBox.classList.add("error")
                : inpuBox.classList.remove("error");

        });
    }

    caracteresCliente() {

        let inpuBox = document.querySelector(".input"),
            textArea = inpuBox.querySelector("textarea");
        var caracteresRestantes = this.tamCliente;

        textArea.addEventListener("keyup", () => {

            let valLenght = textArea.value.length;
            this.tamCliente = caracteresRestantes - valLenght;
            valLenght < 30
                ? inpuBox.classList.add("error")
                : inpuBox.classList.remove("error");

        });
    }

    caracteresMedica() {

        let inpuBox = document.querySelector(".inputprescricao"),
            textArea = inpuBox.querySelector("textarea");
        var caracteresRestantes = this.tamMedica;

        textArea.addEventListener("keyup", () => {

            let valLenght = textArea.value.length;
            this.tamMedica = caracteresRestantes - valLenght;
            valLenght < 30
                ? inpuBox.classList.add("error")
                : inpuBox.classList.remove("error");

        });
    }

    caracteresExame() {

        let inpuBox = document.querySelector(".input-exame"),
            textArea = inpuBox.querySelector("textarea");
        var caracteresRestantes = this.tamExame;

        textArea.addEventListener("keyup", () => {

            let valLenght = textArea.value.length;
            this.tamExame = caracteresRestantes - valLenght;
            valLenght < 30
                ? inpuBox.classList.add("error")
                : inpuBox.classList.remove("error");

        });
    }

    voltar() {
        this.isDetalhes = false;
        this.isHistorico = false;
        this.checkedConsulta = true;

      /*  if(this.historico =='atendimento'){
            this.router.navigate(['/pages/atendimento/detalhe-atendimento'])
        }else {
            this.router.navigate(['/pages/gestao-paciente/paciente'])

        }*/

        this.router.navigate(['/pages/atendimento/buscar-atendimento'])

    }

    public onUploadAtestado = ($event: Event, element) => {

        const target = $event.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];
        this.inputFileAtestado.nativeElement.innerText = file.name;

        this.convertToAtestado(file, element);
    }

    public convertToAtestado(file: File, element) {

        const observable = new Observable((subscriber: Subscriber<any>) => {
            this.readFile(file, subscriber)
        })

        observable.subscribe((d: String) => {
            this.anexoAtestado = d.slice(d.indexOf(",") + 1);
        })

    }

    public onUploadReceita = ($event: Event, element) => {

        const target = $event.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];
        this.inputFileReceita.nativeElement.innerText = file.name;

        this.convertToReceita(file, element);
    }

    public convertToReceita(file: File, element) {

        const observable = new Observable((subscriber: Subscriber<any>) => {
            this.readFile(file, subscriber)
        })

        observable.subscribe((d: String) => {

            this.anexoReceita = d.slice(d.indexOf(",") + 1);
        })

    }

    public readFile(file: File, subscribe: Subscriber<any>) {
        const filereader = new FileReader();

        filereader.readAsDataURL(file)
        filereader.onload = () => {
            subscribe.next(filereader.result);
            subscribe.complete()
        }
        filereader.onerror = () => {
            subscribe.error()
            subscribe.complete()
        }
    }

    agendarRetorno(data,form){
        if(data==='S'){
        this.isretorno= true;
        }else{
        this.isretorno= false;
        this.formConsultaPaciente.controls['horarioSelected'].setValue();
        }      
    }

    processa_valores(data){

        var retorno = null;

        if (!isNaN(data)) {
            // Converte para string e realiza o replace
            retorno = String(data)
              .replace(/,/g, '.')  // Substitui vírgulas por pontos
              .replace(/[^\d.]/g, '');  // Remove qualquer coisa que não seja dígito ou ponto
          
          } else {
            retorno = 0;
          }
          return retorno;
    }

    extrairHorarios(horarios: string[]): { data: string, horaInicio: string, horaFim: string } {
        return {
          data: horarios[0],
          horaInicio: horarios[2],
          horaFim: horarios[4]
        };
      }

    salvar(data) {

     //   this.isSaving = true;

        this.fetchData(true)

        if(data.detalhesCliente==null){
            this.toastrService.warning('Por Favor Informe dos Os Detalhes do Cliente','Aditi Care!');
            this.isSaving = false;
            this.fetchData(false)
            return false;

        } else
        if(data.prescricaoMedica==null){
            this.toastrService.warning('Por Favor Informe a Prescrição Médica','Aditi Care!');
            this.isSaving = false;
            this.fetchData(false)
            return false;

        } else
        if(data.detalhesInterno==null){
            this.toastrService.warning('Por Favor Informe os Detalhes Internos','Aditi Care!');
            this.isSaving = false;
            this.fetchData(false)
            return false;

        } 
        else
        if(data.tempoRetorno==null){
            this.toastrService.warning('Por Favor Informe o Tempo de Retorno','Aditi Care!');
            this.isSaving = false;
            this.fetchData(false)
            return false;

        } else 
        if (!this.validar_valor(data.altura) || 
        !this.validar_valor(data.peso) || 
        !this.validar_valor(data.circCabeca) || 
        !this.validar_valor(data.circAbdomen) || 
        !this.validar_valor(data.tempoRetorno)) 
        {
            this.toastrService.warning('Os valores de Altura, Peso ou Circunferências Não São Válidos', 'Aditi Care!');
            this.isSaving = false;
            this.fetchData(false);
            return false;
        }
    
        else{
            
            if(data.horarioSelected!==null && data.horarioSelected!== undefined && !this.agendado ){

                let Available = false;

                const clinic = localStorage.getItem('bway-clinica');
                if (clinic) {
                  const clinicObj = JSON.parse(clinic);
                  this.clinicId = clinicObj[0].id;
                }
               
                const dataTemp = data.horarioSelected.split(" ");

                let resultado = this.extrairHorarios(dataTemp);


                if(this.dadosHorario.horaInicio !== null && this.dadosHorario.horaInicio !== undefined){
                    Available = true;
                  }
                  
                
                let registerReagendamento = {
                    doctorId: this.atendimento.doctorId,
                    clinicId: this.clinicId,
                    userId: this.atendimento.userId,
                    childId: this.atendimento.idChild,
                    dateService:this.formatarData(resultado.data),
                    startTime: resultado.horaInicio.trim(),
                    endTime: resultado.horaFim.trim(),
                    healthPlanId: this.atendimento.planId,
                    typePaymentId: 1,
                    typeServiceId: this.atendimento.typeServiceId ?? 1,
                    meetingUrl: this.dadosHorario.data === undefined ? resultado.data.concat(' - ', this.atendimento.userId, ' - ', resultado.horaInicio, ' - ', this.doctorId) : this.dadosHorario.data.concat(' - ', this.atendimento.userId, ' - ', resultado.horaInicio, ' - ', this.atendimento.doctorId),
                    specialtyId:  this.atendimento.specialtyId ?? 1,
                    paymentInCreation:false,
                    isReturn:  false ,
                    dontCheckAvailable: Available,
                    procedureId: this.atendimento.procedureId,
                    customDuration: null                }

               this.service.salvarAgendamento(registerReagendamento, (response => {
                    this.isActive = false;
                    this.toastrService.success('Agendamento Realizado com Sucesso','Aditi Care!');   
                    this.agendado = true;     
                }), (error) => {
                    this.isActive = false;
                    this.toastrService.danger(error.message,'Aditi Care!');
                    this.fetchData(false)
                    return false;
                });

            }

        let register = {
            serviceId: this.atendimento.id,  // id da consulta da buscar-atendimento
            description: this.decodeHexadecimalString(data.detalhesCliente),
            prescription: this.decodeHexadecimalString(data.prescricaoMedica),  //Prescrição campo novo que vira da tela detalhes
            urlPrescription: data.urlReceita,
            timeReturn: this.processa_valores(data.tempoRetorno),
            height:this.processa_valores(data.altura),
            weight: this.processa_valores(data.peso),
            headSize:this.processa_valores(data.circCabeca),
            abdomenSize: this.processa_valores(data.circAbdomen),
            removalReport: null,
            urlRemovalReport: data.urlAtestado,
            prescriptionAttachment: this.anexoAtestado, //anexo mandar igual o da imagem
            removalAttachment: this.anexoReceita, // anexo
            descriptionClinic: this.decodeHexadecimalString(data.detalhesInterno),
            descriptionUser: this.decodeHexadecimalString(data.detalhesCliente),
            urlMedicalOrder: data.urlExame,
            descriptionMedicalOrder: this.decodeHexadecimalString(data.pedidoExame),
        }

        this.service.salvarDetalheAtendimento(register, (response => {
            this.toastrService.success('Prontuario Cadastrado com Sucesso','Aditi Care!');
            this.checkedConsulta=true;
            this.AlterarStatusStorage();
            localStorage.removeItem('draftAtendimento');
            localStorage.removeItem('histDetails');
            localStorage.removeItem('meuCardData');
            this.fetchData(false)
            this.voltar();
        }), (error) => {
            this.isActive = false;
            this.toastrService.danger(error.message,'Aditi Care!');
            this.isSaving = false;
            this.fetchData(false)
        });
        this.isSaving = false;
        this.fetchData(false) 
    }
    }

     decodeHexadecimalString(encodedString: string): string {
        try {
          const decodedString = decodeURIComponent(encodedString);
          return decodedString;
        } catch (error) {
          console.error('Erro ao decodificar a sequência:', error);
          return encodedString; // Retorna uma string vazia em caso de erro
        }
      }

      htmldecodeHexadecimalString(element: HTMLTextAreaElement, encodedString: string): void {
        try {
       
         const decodedString = decodeURIComponent(encodedString);
      
      
          if (element.id === 'prescricaoMedica') {
            this.formConsultaPaciente.get('prescricaoMedica')?.setValue(decodedString);
          }else   if (element.id === 'detalhesInterno') {
            this.formConsultaPaciente.get('detalhesInterno')?.setValue(decodedString);
          } else   if (element.id === 'detalhesCliente') {
            this.formConsultaPaciente.get('detalhesCliente')?.setValue(decodedString);
          }  else   if (element.id === 'pedidoExame') {
            this.formConsultaPaciente.get('pedidoExame')?.setValue(decodedString);
          }
        } catch (error) {
          console.error('Erro ao decodificar a sequência:', error);
        }
      }
      

    formatarData(dataString) {
        // Verifica se a string está no formato correto (dia/mês/ano)
        const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        const match = dataString.match(regex);
    
        if (!match) {
            // A string não está no formato esperado
            //("Formato de data inválido.");
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
    

    UltimaConsulta(){

        this.fetchData(true)

        this.isActive = true
        let params = new HttpParams();

        params = params.append('userId', this.atendimento.userId)
        if(this.atendimento.idChild !=null){
            params = params.append('childId',this.atendimento.idChild)
        }
        params = params.append('doctorId', this.atendimento.doctorId)
       


        this.service.BuscarUltimaConsulta(params, (response) => {

            if(response?.dateRegister){
            this.isActive = false;

            let v_descriptionUser = null;
            let v_descriptionClinic = null;

           if(this.hasSpecialTags(response?.dateRegister)){
            v_descriptionUser = this.sanitizer.bypassSecurityTrustHtml(response?.descriptionUser)
            this.hasSpecial = true;
           }else{
            v_descriptionUser = response?.descriptionUser;
           }

           if(this.hasSpecialTags(response?.descriptionClinic)){
            v_descriptionClinic = this.sanitizer.bypassSecurityTrustHtml(response?.descriptionClinic)
            this.html_string = this.sanitizer.bypassSecurityTrustHtml(response?.descriptionClinic);
            v_descriptionClinic = this.sanitizer.bypassSecurityTrustHtml(response?.descriptionClinic);
            this.hasSpecial = true;
           }else{
            v_descriptionClinic = response?.descriptionClinic;
            this.formConsultaPaciente.controls['detalhesInterno'].setValue(this.decodeHexadecimalString(v_descriptionClinic));
           }

            // Defina o valor no controle do formulário
            this.formConsultaPaciente.controls['detalhesCliente'].setValue(this.decodeHexadecimalString(v_descriptionUser));
            this.formConsultaPaciente.controls['tempoRetorno'].setValue(response?.timeReturn ?? null);
            this.formConsultaPaciente.controls['altura'].setValue(response?.height ?? null);
            this.formConsultaPaciente.controls['peso'].setValue(response?.weight ?? null);
            this.formConsultaPaciente.controls['circCabeca'].setValue(response?.headSize ?? null);
            this.formConsultaPaciente.controls['circAbdomen'].setValue(response?.abdomenSize ?? null);
         //   this.formConsultaPaciente.controls['urlReceita'].setValue(response?.urlPrescription ?? null);
         //   this.formConsultaPaciente.controls['urlAtestado'].setValue(response?.urlRemovalReport ?? null);
            this.formConsultaPaciente.controls['prescricaoMedica'].setValue(this.decodeHexadecimalString(response?.prescription ?? null));
            this.formConsultaPaciente.controls['pedidoExame'].setValue(this.decodeHexadecimalString(response?.descriptionMedicalOrder ?? null));
         //   this.formConsultaPaciente.controls['urlExame'].setValue(response?.urlMedicalOrder ?? null);

            this.fetchData(false)

            this.toastrService.success('Historico Recuperado com Sucesso','Aditi Care');
        }else{
            this.toastrService.warning('Não Existe Historico para Este Paciente','Aditi Care');
            this.fetchData(false)

         }

        }, (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message,'Aditi Care');
            this.fetchData(false)

        });
        
    }

    
  fetchData(data) {
    if(data){
    // Mostra o loader
    this.isLoader =true
    }else{
      setTimeout(() => {
        // Oculta o loader após o atraso
        this.isLoader =false
    }, 2000);
}
}

validar_valor(data){

    if (data && data !== 'undefined' && data !== '' && typeof data === 'string' && data.trim() !== '') {
       
        const valorFormatado = data.replace(/,/g, '.').replace(/[^\d.]/g, '');
    
        // Verifica se o valor formatado é um número decimal válido
        if (!valorFormatado.match(/^\d+(\.\d+)?$/)) {
            this.toastrService.warning('O valor informado não é um número válido', 'Aditi Care!');
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
    

}

    AlterarStatusStorage(){
        const allData = localStorage.getItem('detalhesData')

        if (allData) {
          // Converta os dados de string para objeto
          const parsedData = JSON.parse(allData);

          parsedData.status = '04 - Consulta Finalizada';

          this.saveData('detalhesData', parsedData);

        }
    }

    hasSpecialTags(text: string | null | undefined): boolean {
        // Verifica se o texto não é nulo ou indefinido e contém os caracteres específicos
        return text !== null && text !== undefined &&
            (text.includes('</strong>') || text.includes('</p>') || text.includes(' '));
    }
    
    visualizar(data) {

        this.isActive = true
        let params = new HttpParams();
        params = params.append('appointmentId', data.id)

                this.fetchData(true)


        this.service.visualizarHistorico(params, (response) => {

            this.isActive = false;
            this.isDetalhes = true;
            this.isHistorico = false;

            let v_descriptionUser = null;
            let v_descriptionClinic = null;
           
           // this.html_cliente = this.sanitizer.bypassSecurityTrustHtml(response?.descriptionClinic);
           // this.cdRef.detectChanges();

           if(this.hasSpecialTags(response?.descriptionUser)){
            v_descriptionUser = this.sanitizer.bypassSecurityTrustHtml(response?.descriptionUser)
            this.hasSpecial = true;
           }else{
            v_descriptionUser = response?.descriptionUser;
           }

           if(this.hasSpecialTags(response?.descriptionClinic)){
            v_descriptionClinic = this.sanitizer.bypassSecurityTrustHtml(response?.descriptionClinic)
            this.html_string = this.sanitizer.bypassSecurityTrustHtml(response?.descriptionClinic);
            v_descriptionClinic = this.sanitizer.bypassSecurityTrustHtml(response?.descriptionClinic);
            this.hasSpecial = true;
           }else{
            v_descriptionClinic = response?.descriptionClinic;
            this.html_string = this.sanitizer.bypassSecurityTrustHtml(response?.descriptionClinic);

           }
           
            // Defina o valor no controle do formulário
            this.formConsultaPaciente.controls['detalhesCliente'].setValue(this.decodeHexadecimalString(v_descriptionUser));
            this.formConsultaPaciente.controls['detalhesInterno'].setValue(this.decodeHexadecimalString(v_descriptionClinic));
            this.formConsultaPaciente.controls['tempoRetorno'].setValue(response?.timeReturn ?? null);
            this.formConsultaPaciente.controls['altura'].setValue(response?.height ?? null);
            this.formConsultaPaciente.controls['peso'].setValue(response?.weight ?? null);
            this.formConsultaPaciente.controls['circCabeca'].setValue(response?.headSize ?? null);
            this.formConsultaPaciente.controls['circAbdomen'].setValue(response?.abdomenSize ?? null);
            this.formConsultaPaciente.controls['urlReceita'].setValue(response?.urlPrescription ?? null);
            this.formConsultaPaciente.controls['urlAtestado'].setValue(response?.urlRemovalReport ?? null);
            this.formConsultaPaciente.controls['prescricaoMedica'].setValue(this.decodeHexadecimalString(response?.prescription ?? null));
            this.formConsultaPaciente.controls['pedidoExame'].setValue(this.decodeHexadecimalString(response?.descriptionMedicalOrder ?? null));
            this.formConsultaPaciente.controls['urlExame'].setValue(response?.urlMedicalOrder ?? null);

            this.fetchData(false)

        }, (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message);
            this.fetchData(false)

        });

    }
     
    number(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;

        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    previousPage() {

        localStorage.removeItem('histDetails');

        if(this.atendimento.findhistorico === true){
            this.router.navigate(['/pages/gestao-paciente/paciente'])

        }else {
            this.router.navigate(['/pages/atendimento/detalhe-atendimento'])
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

          calcularIMC(data){
            

            if(data.controls.altura.value!=null){

                const alturaInput = data.controls.altura.value.toString();
                const pesoInput = data.controls.peso.value.toString();
                
                // Substitua vírgulas por pontos
                const altura = alturaInput.replace(/,/g, '.');
                const peso = pesoInput.replace(/,/g, '.');
                
        
                // Cálculo do IMC
                const V_imc = peso / (altura * altura);

                // Arredondamento

                const V_imc_arredondado = V_imc.toFixed(2);
        
                // Exibindo o resultado
                this.formConsultaPaciente.controls['imc'].setValue(V_imc_arredondado ?? null);

            }else{
                this.toastrService.warning('Por Favor Preencha Altura e o Peso Para o Calculo','Aditi Care!');
            }
       
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
