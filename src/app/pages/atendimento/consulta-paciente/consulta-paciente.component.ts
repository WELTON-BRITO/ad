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
    public hasSpecial: boolean = false;
    public html_string: any ;

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
        };
    public anexoAtestado = null;
    public anexoReceita = null;
    public rowData = null;
    public endDate = new Date()
    public startDate = new Date();

    
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
        })

        let data = history.state

        if(localStorage.getItem('detalhesData')!==null){
            
            const allData = localStorage.getItem('detalhesData')

            if (allData) {
              // Converta os dados de string para objeto
              const parsedData = JSON.parse(allData);
              this.atendimento = parsedData;
            }

    }else if(data[0].tela =='atendimento' && data[0].rowData.user!=null){

        const dataNascimento = data[0].rowData.child?.birthDate ?? data[0].rowData.user?.birthDate ?? '20240101';
        const idadePessoa = this.calcularIdade(dataNascimento) ?? null;
     
        let allData = {
          medico: data[0].rowData.doctor?.name ?? null,
          nomePaciente: data[0].rowData.child?.name ?? data[0].rowData.user?.name ?? null,
          nomeResponsavel: data[0].rowData.user?.name ?? null,
          data: moment(data[0].rowData.dateService).format('DD/MM/YYYY'),
          horario: data[0].rowData.startTime.concat(' - ', data[0].rowData.endTime),
          formaPagamento: data[0]?.rowData.typePayment?? null,
          modalidade: data[0].rowData.typeService?? null,
          urlCall: data[0].rowData.meetingUrl?? null,
          status: data[0].rowData.status?? null,
          especialidade: data[0].rowData.specialty?.name ?? null,
          convenio: data[0].rowData.plan?.name ?? null,
          id: data[0].rowData.id?? null,
          comprovante: data[0].rowData.paymentProo?? null,
          nameFather: data[0].rowData.child?.nameFather ?? null,
          nameMother: data[0].rowData.child?.nameMother ?? null,
          telefone: data[0].rowData.user?.cellPhone ?? null,
          email: data[0].rowData.user?.emailUser ?? null,
          dateNasc: idadePessoa ?? null,
          ultimaConsulta: data[0].rowData.child?.dateRegister ?? null,
          doctorId: data[0].rowData.doctor?.id ?? null,
          userId: data[0].rowData.user?.id ?? null,
          idChild: data[0].rowData.child?.idChild ?? null,
          sexo: data[0].rowData.biologicalSex === 'M' ? 'Masculino' : 'Feminino' ?? null,
          tipoSanguineo: data[0].rowData.child?.bloodType ?? null,
          patchPaciente: false,
      };
           
      this.atendimento = allData;

      this.atendimento.status = data[0].rowData.status?? null;
  
      this.saveData('detalhesData', allData);
    }
    else{
        this.router.navigate(['/pages/atendimento/buscar-atendimento'])

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
        

        if(localStorage.getItem('draftAtendimento') !== null)
        {

            const allData = localStorage.getItem('draftAtendimento')
                
            if (allData) {
              // Converta os dados de string para objeto
              const parsedData = JSON.parse(allData);
              this.formConsultaPaciente.controls['detalhesCliente'].setValue(parsedData.detalhesCliente ?? null);
              this.formConsultaPaciente.controls['detalhesCliente'].setValue(parsedData?.detalhesCliente ?? null);
              this.formConsultaPaciente.controls['detalhesInterno'].setValue(parsedData?.detalhesInterno ?? null);
              this.formConsultaPaciente.controls['tempoRetorno'].setValue(parsedData?.tempoRetorno ?? null);
              this.formConsultaPaciente.controls['altura'].setValue(parsedData?.altura ?? null);
              this.formConsultaPaciente.controls['peso'].setValue(parsedData?.peso ?? null);
              this.formConsultaPaciente.controls['circCabeca'].setValue(parsedData?.circCabeca ?? null);
              this.formConsultaPaciente.controls['circAbdomen'].setValue(parsedData?.circAbdomen ?? null);
              this.formConsultaPaciente.controls['urlReceita'].setValue(parsedData?.urlReceita ?? null);
              this.formConsultaPaciente.controls['urlAtestado'].setValue(parsedData?.urlAtestado ?? null);
              this.formConsultaPaciente.controls['prescricaoMedica'].setValue(parsedData?.prescricaoMedica ?? null);
              this.formConsultaPaciente.controls['pedidoExame'].setValue(parsedData?.pedidoExame ?? null);
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
                    name: data.doctor.name,
                    birthDate: moment(data.child.birthDate).format('DD/MM/YYYY') ?? moment(data.user.birthDate).format('DD/MM/YYYY'),
                    id: data.id,
                    dateService: data.dateService,
                    horario: data.startTime +" - "+ data.endTime,
                    typeService: data.typeService,
                    cellPhoneUser: data.user.cellPhone,
                    emailUser:data.user.emailUser,
                    federalIdUser: data.user.federalId,
                    NameResponse: data.user.name
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
    

        }, (error) => {
            this.isActive = false;
            if (error && error.status === 400) {
                this.toastrService.warning("Não Foram Encontradas Consultas Para Este Paciente.", 'Aditi Care');
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
                  }
    }
    
    salvareContinuar(data){

        this.saveData('draftAtendimento', data);
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

        let inpuBox = document.querySelector(".input-medica"),
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

        if(this.atendimento.patchPaciente === true){
            this.router.navigate(['/pages/atendimento/detalhe-atendimento'])
        }else {
            this.router.navigate(['/pages/gestao-paciente/paciente'])

        }
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

    salvar(data) {

        this.isSaving = true;

        if(data.detalhesCliente==null){
            this.toastrService.warning('Por Favor Informe dos Os Detalhes do Cliente','Aditi Care!');
            this.isSaving = false;
        }else
        if(data.prescricaoMedica==null){
            this.toastrService.warning('Por Favor Informe a Prescrição Médica','Aditi Care!');
            this.isSaving = false;
        }
        if(data.detalhesCliente==null){
            this.toastrService.warning('Por Favor Informe a Prescrição Médica','Aditi Care!');
            this.isSaving = false;
        }
        else{

        let register = {
            serviceId: this.atendimento.id,  // id da consulta da buscar-atendimento
            description: data.detalhesCliente,
            prescription: data.prescricaoMedica,  //Prescrição campo novo que vira da tela detalhes
            urlPrescription: data.urlReceita,
            timeReturn: data.tempoRetorno,
            removalReport: null,
            urlRemovalReport: data.urlAtestado,
            prescriptionAttachment: this.anexoAtestado, //anexo mandar igual o da imagem
            removalAttachment: this.anexoReceita, // anexo
            height: data.altura ? data.altura.replace(/,/g, '.') : '0',
            weight: data.peso ? data.peso.replace(/,/g, '.') : '0',
            headSize: data.circCabeca ? data.circCabeca.replace(/,/g, '.') : '0',
            abdomenSize: data.circAbdomen ? data.circAbdomen.replace(/,/g, '.') : '0',
            descriptionClinic: data.detalhesInterno,
            descriptionUser: data.detalhesCliente,
            urlMedicalOrder: data.urlExame,
            descriptionMedicalOrder: data.pedidoExame,
        }

        this.isActive = true;
        this.service.salvarDetalheAtendimento(register, (response => {
            this.isActive = false;
            this.toastrService.success('Prontuario Cadastrado com Sucesso','Aditi Care!');
            this.checkedConsulta=true;
            this.AlterarStatusStorage();
            localStorage.removeItem('draftAtendimento');
            localStorage.removeItem('histDetails');
            this.voltar();
        }), (error) => {
            this.isActive = false;
            this.toastrService.danger(error.message);
            this.isSaving = false;
        });
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
           }

            // Defina o valor no controle do formulário
            this.formConsultaPaciente.controls['detalhesCliente'].setValue(v_descriptionUser);
            this.formConsultaPaciente.controls['detalhesInterno'].setValue(v_descriptionClinic);
            this.formConsultaPaciente.controls['tempoRetorno'].setValue(response?.timeReturn ?? null);
            this.formConsultaPaciente.controls['altura'].setValue(response?.height ?? null);
            this.formConsultaPaciente.controls['peso'].setValue(response?.weight ?? null);
            this.formConsultaPaciente.controls['circCabeca'].setValue(response?.headSize ?? null);
            this.formConsultaPaciente.controls['circAbdomen'].setValue(response?.abdomenSize ?? null);
            this.formConsultaPaciente.controls['urlReceita'].setValue(response?.urlPrescription ?? null);
            this.formConsultaPaciente.controls['urlAtestado'].setValue(response?.urlRemovalReport ?? null);
            this.formConsultaPaciente.controls['prescricaoMedica'].setValue(response?.prescription ?? null);
            this.formConsultaPaciente.controls['pedidoExame'].setValue(response?.descriptionMedicalOrder ?? null);
            this.formConsultaPaciente.controls['urlExame'].setValue(response?.urlMedicalOrder ?? null);

        }, (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message);
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



        if(this.atendimento.patchPaciente === true){
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
