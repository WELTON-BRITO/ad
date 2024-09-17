import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { AtendimentoService } from '../atendimento.service';
import * as moment from 'moment';
import { Observable, Subscriber } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Chart } from 'chart.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dA } from '@fullcalendar/core/internal-common';



declare var $: any;
@Component({
    selector: 'ngx-consulta-paciente',
    styleUrls: ['./consulta-paciente.component.scss'],
    templateUrl: './consulta-paciente.component.html',
})

    export class ConsultaPacienteComponent implements OnDestroy {

        @ViewChild('heightChartCanvas') heightChartCanvas: ElementRef;
        @ViewChild('weightChartCanvas') weightChartCanvas: ElementRef;
        @ViewChild('circunferenciaCanvas') circunferenciaCanvas: ElementRef;
        @ViewChild('pesoChartCanvas') pesoChartCanvas: ElementRef;

        @ViewChild('heightZChartCanvas') heightZChartCanvas: ElementRef;
        @ViewChild('weightZChartCanvas') weightZChartCanvas: ElementRef;
    
    ischart = false;

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
    public zScores = null;
    public safeUrl = null;
    public avatar = "assets/images/avatar.png";
    public chartInstance = null;
    public notaFiscal = true;
    public listChatHistory = null;
    public tipoCardEncaixe: any[] = [{
        id: '',
        horaInicio: '',
        horaFim: ''
    }];
    public chart: any;
    public percentiles :any;
    public dataNascimento;
    public sexo;

    public chartZ = false;
    public chartP = false;

    public listPrescricao = [];
    public listExames = [];

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
        emitirNotaFiscal:null,
        isReturn: null,
        urlCall: null,
            };
    public anexoAtestado = null;
    public anexoReceita = null;
    public rowData = null;
    public endDate = new Date()
    public startDate = new Date();
    public historico = null;
    public emitirNotaFiscalFlag = true;


    
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
            faixaIMC: [null],
            id: null,
            patchPaciente: false, 
            planId: null,
            procedureId: null,
            specialtyId: null,
            typeServiceId: null,
            findhistorico: null,
            emitirNotaFiscal:null,
            prescricao:null,
            pedido:null,
            isReturn: null,
            urlCall: null,
        })

         var data = history.state

         this.historico = data;


        if(localStorage.getItem('detalhesData')!==null){
            
            const allData = localStorage.getItem('detalhesData')

            if (allData) {
              // Converta os dados de string para objeto
              const parsedData = JSON.parse(allData);
              this.atendimento = parsedData;

              this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.atendimento.urlCall);
      
              this.dataNascimento = this.atendimento.dateNasc;    

              this.sexo =  this.atendimento.sexo === 'M' ? 'male' : 'female' ?? 'male';
            }

    }else if(data[0].tela =='atendimento' && data[0].rowData.userName!=null){


        this.dataNascimento = data[0].rowData.childBirthDate ?? data[0].rowData.userBirthDate ?? '2024-01-01'; // to-do incluir campo de aniversario do usuario no retorno

        const idadePessoa = this.calcularIdade(this.dataNascimento) ?? null;

        this.sexo = data[0].rowData.childBiologicalSex === 'M' ? 'male' : 'female' ?? 'male';
    
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
          sexo: data[0].rowData.childBiologicalSex === 'M' ? 'Masculino' : 'Feminino' ?? 'Masculino' ,
          tipoSanguineo: data[0].rowData.childBloodType ?? null,
          patchPaciente: false,
          planId: data[0].rowData.planId,
          procedureId: data[0].rowData.procedureId,
          specialtyId: data[0].rowData.specialtyId,
          typeServiceId: data[0].rowData.typeServiceId,
          avatar: data[0].rowData.avatarChild ?? data[0].rowData.avatar ?? this.avatar,
          findhistorico: false,
          emitirNotaFiscal:null,
          isReturn: data[0].rowData.isReturn
      };

           
      this.atendimento = allData;

      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.atendimento.urlCall);
      
      this.atendimento.status = data[0].rowData.status?? null;
  
      this.saveData('detalhesData', allData);
    }
    else{
        this.router.navigate(['/pages/atendimento/buscar-atendimento'])

    }

    this.GetTemplates();
    
    if(this.atendimento.idChild !=null){
    this.getHistoricoChart()
    }
    

    }

    calcularIdadeEmSemanas(data: string): number {
        const hoje = new Date();
        let dataNascimento: Date;
    
        if (data.includes('-')) {
            // Formato "2024-08-21"
            dataNascimento = new Date(data);
        } else if (data.includes('Nasceu em')) {
            // Formato "Nasceu em 2024, e Tem 0 anos 3 Meses e 29 Dias de Vida"
            const partes = data.match(/(\d+) anos (\d+) Meses e (\d+) Dias/);
            if (partes) {
                const anos = parseInt(partes[1], 10);
                const meses = parseInt(partes[2], 10);
                const dias = parseInt(partes[3], 10);
    
                dataNascimento = new Date(
                    hoje.getFullYear() - anos,
                    hoje.getMonth() - meses,
                    hoje.getDate() - dias
                );
            } else {
                throw new Error('Formato de data inválido');
            }
        } else {
            throw new Error('Formato de data inválido');
        }
    
        const diff = hoje.getTime() - dataNascimento.getTime();
        const idadeEmSemanas = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    
        return idadeEmSemanas;
    }
    

    calcularIdadeEmMeses(data: string): number {

        const hoje = new Date();
        let dataNascimento: Date;
    
        if (data.includes('-')) {
            // Formato "2024-08-21"
            dataNascimento = new Date(data);
        } else if (data.includes('Nasceu em')) {
            // Formato "Nasceu em 2024, e Tem 0 anos 3 Meses e 29 Dias de Vida"
            const partes = data.match(/(\d+) anos (\d+) Meses e (\d+) Dias/);
            if (partes) {
                const anos = parseInt(partes[1], 10);
                const meses = parseInt(partes[2], 10);
                const dias = parseInt(partes[3], 10);
    
                dataNascimento = new Date(
                    hoje.getFullYear() - anos,
                    hoje.getMonth() - meses,
                    hoje.getDate() - dias
                );
            } else {
                throw new Error('Formato de data inválido');
            }
        } else {
            throw new Error('Formato de data inválido');
        }
    
        const anos = hoje.getFullYear() - dataNascimento.getFullYear();
        const meses = hoje.getMonth() - dataNascimento.getMonth();
        const dias = hoje.getDate() - dataNascimento.getDate();
    
        let idadeEmMeses = anos * 12 + meses;
    
        // Ajuste se o dia do mês atual for menor que o dia do mês de nascimento
        if (dias < 0) {
            idadeEmMeses--;
        }
    
        return idadeEmMeses;
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

        emitirNotaFiscal(data){

            if(data==='S'){
                this.emitirNotaFiscalFlag = true;
            }else{
                this.emitirNotaFiscalFlag = false;
                this.formConsultaPaciente.controls['emitirNotaFiscal'].setValue(data);
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

      calculateGrowth(ageInMonths: number, height: number, weight: number, gender: string) {
        const heightPercentiles = this.getPercentiles(this.percentiles[gender].height, height);
        const weightPercentiles = this.getPercentiles(this.percentiles[gender].weight, weight);
        return { heightPercentiles, weightPercentiles };
    }
    
    
    getPercentiles(percentiles: any, value: number) {
        const result = {};
        const percentilKeys = [5, 25, 50, 75, 95];
        for (let i = 0; i < percentilKeys.length; i++) {
            const key = percentilKeys[i];
            result[key] = percentiles[key];
        }
        return result;
    }

    ChartCrescimento(data)
    {

        if(this.dataNascimento == null){
            this.toastrService.warning('Data de Nascimento Inválida','Aditi Care');
        }else if(data.altura == null){
            this.toastrService.warning('Por Favor informe a Altura do Paciente','Aditi Care');
        }else if(data.peso == null){
            this.toastrService.warning('Por Favor informe o Peso do Paciente','Aditi Care');
        }

        else{
            const meses = this.calcularIdadeEmMeses(this.dataNascimento)

            this.ischart = true;

            let sexo;
            if (this.atendimento.sexo === 'masculino') {
                sexo = 'male';
            } else if (this.atendimento.sexo === 'feminino') {
                sexo = 'female';
            } else {
                sexo = 'male'; // ou qualquer valor padrão que você preferir
            }

            this.chartP=true;

            this.chartZ=false;
            

            this.createChart(sexo, meses, data.altura, data.peso, 'Altura');

            this.createChart(sexo, meses, data.altura, data.peso, 'Peso');

            this.createChartCabecaPercentil(sexo, meses, data.circCabeca, data.peso, 'Peso');

        }

    }

    ChartCrescimentoZ(data)
    {

        if(this.dataNascimento == null){
            this.toastrService.warning('Data de Nascimento Inválida','Aditi Care');
        }else if(data.altura == null){
            this.toastrService.warning('Por Favor informe a Altura do Paciente','Aditi Care');
        }else if(data.peso == null){
            this.toastrService.warning('Por Favor informe o Peso do Paciente','Aditi Care');
        }else if(data.circCabeca == null){
            this.toastrService.warning('Por Favor informe a circuferencia do Paciente','Aditi Care');
        }

        else{
            var meses = this.calcularIdadeEmMeses(this.dataNascimento)

            this.ischart = true;

            let sexo;
            if (this.atendimento.sexo === 'masculino') {
                sexo = 'male';
            } else if (this.atendimento.sexo === 'feminino') {
                sexo = 'female';
            } else {
                sexo = 'male'; // ou qualquer valor padrão que você preferir
            }
            
            this.chartP=false;

            this.chartZ=true;
            
            if(meses<=3){  // calculo para 13 semanas

             meses = this.calcularIdadeEmSemanas(this.dataNascimento)


                this.createHeightChart(sexo, meses, data.altura, 'Altura');
                this.createHeightChart(sexo, meses, data.peso, 'Peso');
                this.createChartCabeca(sexo, meses, data.circCabeca,data.peso, 'Circunferencia');

            }else if(meses>60){ // calcula para 5 anos

                this.createHeightChartPlus(sexo, meses, data.altura, 'Altura');
                this.createHeightChartPlus(sexo, meses, data.peso, 'Peso');
               // this.createChartCabeca(sexo, meses, data.circCabeca,data.peso, 'Circunferencia');

            }else{ // calculo para 2 anos
            
            this.createHeightChart(sexo, meses, data.altura, 'Altura');
            this.createHeightChart(sexo, meses, data.peso, 'Peso');
            this.createChartCabeca(sexo, meses, data.circCabeca,data.peso, 'Circunferencia');

        }
        }

    }

    createChartCabecaPercentil(gender, currentAgeInMonths,altura,peso,type) {

        const totalMonths = currentAgeInMonths+4; // Ajustado para 24 meses
        const height = altura; // Exemplo de altura em cm
        const weight = peso; // Exemplo de peso em kg

            
            this.percentiles = {
                male: {
                    height: {
                        5:  [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.5, 75.7, 76.9, 78.0, 79.1, 80.2, 81.2, 82.2, 83.2, 84.2, 85.1, 86.0, 86.9, 87.8, 88.7, 89.6, 90.5, 91.4, 92.3, 93.2, 94.1, 95.0, 95.9, 96.8, 97.7, 98.6, 99.5, 100.4, 101.3, 102.2, 103.1, 104.0, 104.9, 105.8, 106.7, 107.6, 108.5, 109.4, 110.3, 111.2, 112.1, 113.0, 113.9, 114.8, 115.7, 116.6, 117.5, 118.4, 119.3, 120.2, 121.1],
                        25: [50.9, 55.7, 59.4, 62.4, 64.9, 66.9, 68.6, 70.2, 71.6, 73.0, 74.3, 75.5, 76.7, 77.9, 79.0, 80.1, 81.2, 82.2, 83.2, 84.2, 85.2, 86.1, 87.0, 87.9, 88.8, 89.7, 90.6, 91.5, 92.4, 93.3, 94.2, 95.1, 96.0, 96.9, 97.8, 98.7, 99.6, 100.5, 101.4, 102.3, 103.2, 104.1, 105.0, 105.9, 106.8, 107.7, 108.6, 109.5, 110.4, 111.3, 112.2, 113.1, 114.0, 114.9, 115.8, 116.7, 117.6, 118.5, 119.4, 120.3, 121.2, 122.1],
                        50: [51.9, 56.7, 60.4, 63.4, 65.9, 67.9, 69.6, 71.2, 72.6, 74.0, 75.3, 76.5, 77.7, 78.9, 80.0, 81.1, 82.2, 83.2, 84.2, 85.2, 86.2, 87.1, 88.0, 88.9, 89.8, 90.7, 91.6, 92.5, 93.4, 94.3, 95.2, 96.1, 97.0, 97.9, 98.8, 99.7, 100.6, 101.5, 102.4, 103.3, 104.2, 105.1, 106.0, 106.9, 107.8, 108.7, 109.6, 110.5, 111.4, 112.3, 113.2, 114.1, 115.0, 115.9, 116.8, 117.7, 118.6, 119.5, 120.4, 121.3, 122.2, 123.1],
                        75: [52.9, 57.7, 61.4, 64.4, 66.9, 68.9, 70.6, 72.2, 73.6, 75.0, 76.3, 77.5, 78.7, 79.9, 81.0, 82.1, 83.2, 84.2, 85.2, 86.2, 87.2, 88.1, 89.0, 89.9, 90.8, 91.7, 92.6, 93.5, 94.4, 95.3, 96.2, 97.1, 98.0, 98.9, 99.8, 100.7, 101.6, 102.5, 103.4, 104.3, 105.2, 106.1, 107.0, 107.9, 108.8, 109.7, 110.6, 111.5, 112.4, 113.3, 114.2, 115.1, 116.0, 116.9, 117.8, 118.7, 119.6, 120.5, 121.4, 122.3, 123.2, 124.1],
                        95: [53.9, 58.7, 62.4, 65.4, 67.9, 69.9, 71.6, 73.2, 74.6, 76.0, 77.3, 78.5, 79.7, 80.9, 82.0, 83.1, 84.2, 85.2, 86.2, 87.2, 88.2, 89.1, 90.0, 90.9, 91.8, 92.7, 93.6, 94.5, 95.4, 96.3, 97.2, 98.1, 99.0, 99.9, 100.8, 101.7, 102.6, 103.5, 104.4, 105.3, 106.2, 107.1, 108.0, 108.9, 109.8, 110.7, 111.6, 112.5, 113.4, 114.3, 115.2, 116.1, 117.0, 117.9, 118.8, 119.7, 120.6, 121.5, 122.4, 123.3, 124.2, 125.1]},
                    weight: [8, 9, 10, 11, 12] // Exemplo de percentis de peso para meninos
                },
                female: {
                    height: {
                        5:  [31.5, 34.2, 36.1, 37.6, 38.8, 39.8, 40.6, 41.3, 41.9, 42.4, 42.9, 43.3, 43.7, 44.0, 44.3, 44.6, 44.9, 45.1, 45.3, 45.5, 45.7, 45.9, 46.1, 46.2, 46.4, 46.5, 46.7, 46.8, 46.9, 47.0, 47.1, 47.2, 47.3, 47.4, 47.5, 47.6, 47.7, 47.8, 47.9, 48.0, 48.1, 48.2, 48.3, 48.4, 48.5, 48.6, 48.7, 48.8, 48.9, 49.0],
                        25: [32.9, 35.6, 37.5, 39.0, 40.2, 41.2, 42.0, 42.7, 43.3, 43.8, 44.3, 44.7, 45.1, 45.4, 45.7, 46.0, 46.3, 46.5, 46.7, 46.9, 47.1, 47.3, 47.5, 47.6, 47.8, 47.9, 48.1, 48.2, 48.3, 48.4, 48.5, 48.6, 48.7, 48.8, 48.9, 49.0, 49.1, 49.2, 49.3, 49.4, 49.5, 49.6, 49.7, 49.8, 49.9, 50.0, 50.1, 50.2, 50.3, 50.4],
                        50: [34.2, 37.0, 38.9, 40.4, 41.6, 42.6, 43.4, 44.1, 44.7, 45.2, 45.7, 46.1, 46.5, 46.8, 47.1, 47.4, 47.7, 47.9, 48.1, 48.3, 48.5, 48.7, 48.9, 49.0, 49.2, 49.3, 49.5, 49.6, 49.7, 49.8, 49.9, 50.0, 50.1, 50.2, 50.3, 50.4, 50.5, 50.6, 50.7, 50.8, 50.9, 51.0, 51.1, 51.2, 51.3, 51.4, 51.5, 51.6, 51.7, 51.8],
                        75: [35.5, 38.3, 40.2, 41.7, 42.9, 43.9, 44.7, 45.4, 46.0, 46.5, 47.0, 47.4, 47.8, 48.1, 48.4, 48.7, 49.0, 49.2, 49.4, 49.6, 49.8, 50.0, 50.2, 50.3, 50.5, 50.6, 50.8, 50.9, 51.0, 51.1, 51.2, 51.3, 51.4, 51.5, 51.6, 51.7, 51.8, 51.9, 52.0, 52.1, 52.2, 52.3, 52.4, 52.5, 52.6, 52.7, 52.8, 52.9, 53.0, 53.1],
                        95: [36.8, 39.6, 41.5, 43.0, 44.2, 45.2, 46.0, 46.7, 47.3, 47.8, 48.3, 48.7, 49.1, 49.4, 49.7, 50.0, 50.3, 50.5, 50.7, 50.9, 51.1, 51.3, 51.5, 51.6, 51.8, 51.9, 52.1, 52.2, 52.3, 52.4, 52.5, 52.6, 52.7, 52.8, 52.9, 53.0, 53.1, 53.2, 53.3, 53.4, 53.5, 53.6, 53.7, 53.8, 53.9, 54.0, 54.1, 54.2, 54.3, 54.4]},
                    weight: [8, 9, 10, 11, 12] // Exemplo de percentis de peso para meninas
                }
            };
        
        const growthData = this.calculateGrowth(currentAgeInMonths, height, weight, gender);


            const ctx = this.circunferenciaCanvas.nativeElement.getContext('2d');
    
            new Chart(ctx, {
                type: 'line',
            data: {
                labels: Array.from({ length: totalMonths }, (_, i) => i + 1),
                datasets: [
                    {
                        label: 'Percentil 5',
                        data: this.percentiles[gender].height[5],
                        borderColor: '#ff0000',
                        fill: false
                    },
                    {
                        label: 'Percentil 25',
                        data: this.percentiles[gender].height[25],
                        borderColor: '#ff8000',
                        fill: false
                    },
                    {
                        label: 'Percentil 50',
                        data: this.percentiles[gender].height[50],
                        borderColor: '#ffff00',
                        fill: false
                    },
                    {
                        label: 'Percentil 75',
                        data: this.percentiles[gender].height[75],
                        borderColor: '#80ff00',
                        fill: false
                    },
                    {
                        label: 'Percentil 95',
                        data: this.percentiles[gender].height[95],
                        borderColor: '#00ff00',
                        fill: false
                    },
                    {
                        label: 'Perímetro cefálico',
                        data: Array(totalMonths).fill(null).map((_, i) => (i === currentAgeInMonths - 1 ? height : null)),
                        borderColor: '#0000ff',
                        fill: false,
                        borderDash: [5, 5],
                        pointBackgroundColor: '#0000ff',
                        pointBorderColor: '#0000ff',
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Gráfico Perímetro cefálico'
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Idade (meses)'
                        },
                        ticks: {
                            maxTicksLimit: 12
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Perímetro cefálico (cm)'
                        },
                        ticks: {
                            min: 49,
                            max: 92,
                            stepSize: 15
                        }
                    }]
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutBounce'
                },
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'xy'
                        },
                        zoom: {
                            enabled: true,
                            mode: 'xy'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Percentil ${context.dataset.label}: ${context.raw}`;
                            }
                        }
                    }
                }
            } 
            
        });
    
    }

    calculateAgeInMonthsD(dateService: string, birthDateInMonths: number): number {
        const serviceDate = new Date(dateService);
        const birthDate = new Date();
        birthDate.setMonth(birthDate.getMonth() - birthDateInMonths);
        const ageInMonths = (serviceDate.getFullYear() - birthDate.getFullYear()) * 12 + (serviceDate.getMonth() - birthDate.getMonth());
        return ageInMonths;
    }
    
    createChartCabeca(gender, currentAgeInMonths,altura,peso,type) {

        var v_periodo ='Idade (meses)';
        const totalMonths = currentAgeInMonths + 4; // Ajustado para 24 meses

        var medias = null;
        var desviosPadrao = null;
        var ctx = null;
        const data = Array(totalMonths).fill(null);
            
         medias = {
            male: [
                34.5, 36.5, 38.0, 39.0, 40.0, 41.0, 42.0, 43.0, 44.0, 45.0, 46.0, 47.0, 48.0, 49.0, 50.0, 51.0, 52.0, 53.0, 54.0, 55.0, 56.0, 57.0, 58.0, 59.0, 60.0, 61.0, 62.0, 63.0, 64.0, 65.0, 66.0, 67.0, 68.0, 69.0, 70.0, 71.0, 72.0, 73.0, 74.0, 75.0, 76.0, 77.0, 78.0, 79.0, 80.0, 81.0, 82.0, 83.0, 84.0, 85.0, 86.0, 87.0, 88.0, 89.0, 90.0, 91.0, 92.0, 93.0, 94.0, 95.0, 96.0
            ],
            female: [
                33.5, 35.5, 37.0, 38.0, 39.0, 40.0, 41.0, 42.0, 43.0, 44.0, 45.0, 46.0, 47.0, 48.0, 49.0, 50.0, 51.0, 52.0, 53.0, 54.0, 55.0, 56.0, 57.0, 58.0, 59.0, 60.0, 61.0, 62.0, 63.0, 64.0, 65.0, 66.0, 67.0, 68.0, 69.0, 70.0, 71.0, 72.0, 73.0, 74.0, 75.0, 76.0, 77.0, 78.0, 79.0, 80.0, 81.0, 82.0, 83.0, 84.0, 85.0, 86.0, 87.0, 88.0, 89.0, 90.0, 91.0, 92.0, 93.0, 94.0, 95.0
            ]
        };
        
         desviosPadrao = {
            male: [
                1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9
            ],
            female: [
                1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8
            ]
        };

        if(currentAgeInMonths<=13)
            {
                this.zScores = {
                    male: {
                    height: {
                        '-3':[30.7,31.5,32.4,33,33.6,34.1,34.6,35,35.4,35.7,36.1,36.4,36.7,37],
                        '-2':[31.9,32.7,33.5,34.2,34.8,35.3,35.7,36.1,36.5,36.9,37.2,37.5,37.9,38.1],
                        '-1':[33.2,33.9,34.7,35.4,35.9,36.4,36.9,37.3,37.7,38.1,38.4,38.7,39,39.3],
                        '0':[34.5,35.2,35.9,36.5,37.1,37.6,38.1,38.5,38.9,39.2,39.6,39.9,40.2,40.5],
                        '1':[35.7,36.4,37,37.7,38.3,38.8,39.2,39.7,40,40.4,40.8,41.1,41.4,41.7],
                        '2':[37,37.6,38.2,38.9,39.4,39.9,40.4,40.8,41.2,41.6,41.9,42.3,42.6,42.9],
                        '3':[38.3,38.8,39.4,40,40.6,41.1,41.6,42,42.4,42.8,43.1,43.4,43.7,44]
    
                ,
                    weight: [8, 9, 10] // Exemplo de z-scores de peso para meninos
                },
                    female: {
                    height: {
                        '-3': [30.3,31.1,31.8,32.4,32.9,33.3,33.7,34.1,34.4,34.7,35,35.3,35.5,35.8],
                        '-2': [31.5,32.2,32.9,33.5,34,34.5,34.9,35.3,35.6,35.9,36.2,36.5,36.8,37],
                        '-1': [32.7,33.4,34.1,34.7,35.2,35.7,36.1,36.5,36.8,37.1,37.4,37.7,38,38.3],
                        '0': [33.9,34.6,35.2,35.8,36.4,36.8,37.3,37.7,38,38.4,38.7,39,39.3,39.5],
                        '1': [35.1,35.7,36.4,37,37.5,38,38.5,38.9,39.2,39.6,39.9,40.2,40.5,40.8],
                        '2': [36.2,36.9,37.5,38.2,38.7,39.2,39.6,40.1,40.4,40.8,41.1,41.4,41.7,42],
                        '3': [37.4,38.1,38.7,39.3,39.9,40.4,40.8,41.3,41.6,42,42.3,42.7,43,43.2],
    
                    weight: [8, 9, 10] // Exemplo de z-scores de peso para meninos
                }
            }
        }
        
          }

          v_periodo ='Idade (Semanas)';

            }    
        else{

        this.zScores = {
                male: {
                height: {
                    '-3':[30.7,33.8,35.6,37,38,38.9,39.7,40.3,40.8,41.2,41.6,41.9,42.2,42.5,42.7,42.9,43.1,43.2,43.4,43.5,43.7,43.8,43.9,44.1,44.2,44.3,44.4,44.5,44.6,44.7,44.8,44.8,44.9,45,45.1,45.1,45.2,45.3,45.3,45.4,45.4,45.5,45.5,45.6,45.6,45.7,45.7,45.8,45.8,45.9,45.9,45.9,46,46,46.1,46.1,46.1,46.2,46.2,46.2,46.3],
                    '-2':[31.9,34.9,36.8,38.1,39.2,40.1,40.9,41.5,42,42.5,42.9,43.2,43.5,43.8,44,44.2,44.4,44.6,44.7,44.9,45,45.2,45.3,45.4,45.5,45.6,45.8,45.9,46,46.1,46.1,46.2,46.3,46.4,46.5,46.6,46.6,46.7,46.8,46.8,46.9,46.9,47,47,47.1,47.1,47.2,47.2,47.3,47.3,47.4,47.4,47.5,47.5,47.5,47.6,47.6,47.6,47.7,47.7,47.7],
                    '-1':[33.2,36.1,38,39.3,40.4,41.4,42.1,42.7,43.3,43.7,44.1,44.5,44.8,45,45.3,45.5,45.7,45.9,46,46.2,46.4,46.5,46.6,46.8,46.9,47,47.1,47.2,47.3,47.4,47.5,47.6,47.7,47.8,47.9,48,48,48.1,48.2,48.2,48.3,48.4,48.4,48.5,48.5,48.6,48.7,48.7,48.7,48.8,48.8,48.9,48.9,49,49,49.1,49.1,49.1,49.2,49.2,49.2],
                    '0':[34.5,37.3,39.1,40.5,41.6,42.6,43.3,44,44.5,45,45.4,45.8,46.1,46.3,46.6,46.8,47,47.2,47.4,47.5,47.7,47.8,48,48.1,48.3,48.4,48.5,48.6,48.7,48.8,48.9,49,49.1,49.2,49.3,49.4,49.5,49.5,49.6,49.7,49.7,49.8,49.9,49.9,50,50.1,50.1,50.2,50.2,50.3,50.3,50.4,50.4,50.4,50.5,50.5,50.6,50.6,50.7,50.7,50.7],
                    '1':[35.7,38.4,40.3,41.7,42.8,43.8,44.6,45.2,45.8,46.3,46.7,47,47.4,47.6,47.9,48.1,48.3,48.5,48.7,48.9,49,49.2,49.3,49.5,49.6,49.7,49.9,50,50.1,50.2,50.3,50.4,50.5,50.6,50.7,50.8,50.9,51,51,51.1,51.2,51.3,51.3,51.4,51.4,51.5,51.6,51.6,51.7,51.7,51.8,51.8,51.9,51.9,52,52,52.1,52.1,52.1,52.2,52.2],
                    '2':[37,39.6,41.5,42.9,44,45,45.8,46.4,47,47.5,47.9,48.3,48.6,48.9,49.2,49.4,49.6,49.8,50,50.2,50.4,50.5,50.7,50.8,51,51.1,51.2,51.4,51.5,51.6,51.7,51.8,51.9,52,52.1,52.2,52.3,52.4,52.5,52.5,52.6,52.7,52.8,52.8,52.9,53,53,53.1,53.1,53.2,53.2,53.3,53.4,53.4,53.5,53.5,53.5,53.6,53.6,53.7,53.7],
                    '3':[38.3,40.8,42.6,44.1,45.2,46.2,47,47.7,48.3,48.8,49.2,49.6,49.9,50.2,50.5,50.7,51,51.2,51.4,51.5,51.7,51.9,52,52.2,52.3,52.5,52.6,52.7,52.9,53,53.1,53.2,53.3,53.4,53.5,53.6,53.7,53.8,53.9,54,54.1,54.1,54.2,54.3,54.3,54.4,54.5,54.5,54.6,54.7,54.7,54.8,54.8,54.9,54.9,55,55,55.1,55.1,55.2,55.2]

            ,
                weight: [8, 9, 10] // Exemplo de z-scores de peso para meninos
            },
                female: {
                height: {
                    '-3': [30.3,33,34.6,35.8,36.8,37.6,38.3,38.9,39.4,39.8,40.2,40.5,40.8,41.1,41.3,41.5,41.7,41.9,42.1,42.3,42.4,42.6,42.7,42.9,43,43.1,43.3,43.4,43.5,43.6,43.7,43.8,43.9,44,44.1,44.2,44.3,44.4,44.4,44.5,44.6,44.6,44.7,44.8,44.8,44.9,45,45,45.1,45.1,45.2,45.2,45.3,45.3,45.4,45.4,45.5,45.5,45.6,45.6,45.7],
                    '-2': [31.5,34.2,35.8,37.1,38.1,38.9,39.6,40.2,40.7,41.2,41.5,41.9,42.2,42.4,42.7,42.9,43.1,43.3,43.5,43.6,43.8,44,44.1,44.3,44.4,44.5,44.7,44.8,44.9,45,45.1,45.2,45.3,45.4,45.5,45.6,45.7,45.8,45.8,45.9,46,46.1,46.1,46.2,46.3,46.3,46.4,46.4,46.5,46.5,46.6,46.7,46.7,46.8,46.8,46.9,46.9,46.9,47,47,47.1],
                    '-1': [32.7,35.4,37,38.3,39.3,40.2,40.9,41.5,42,42.5,42.9,43.2,43.5,43.8,44.1,44.3,44.5,44.7,44.9,45,45.2,45.3,45.5,45.6,45.8,45.9,46.1,46.2,46.3,46.4,46.5,46.6,46.7,46.8,46.9,47,47.1,47.2,47.3,47.3,47.4,47.5,47.5,47.6,47.7,47.7,47.8,47.9,47.9,48,48,48.1,48.1,48.2,48.2,48.3,48.3,48.4,48.4,48.5,48.5],
                    '0': [33.9,36.5,38.3,39.5,40.6,41.5,42.2,42.8,43.4,43.8,44.2,44.6,44.9,45.2,45.4,45.7,45.9,46.1,46.2,46.4,46.6,46.7,46.9,47,47.2,47.3,47.5,47.6,47.7,47.8,47.9,48,48.1,48.2,48.3,48.4,48.5,48.6,48.7,48.7,48.8,48.9,49,49,49.1,49.2,49.2,49.3,49.3,49.4,49.4,49.5,49.5,49.6,49.6,49.7,49.7,49.8,49.8,49.9,49.9],
                    '1': [35.1,37.7,39.5,40.8,41.8,42.7,43.5,44.1,44.7,45.2,45.6,45.9,46.3,46.5,46.8,47,47.2,47.4,47.6,47.8,48,48.1,48.3,48.4,48.6,48.7,48.9,49,49.1,49.2,49.3,49.4,49.6,49.7,49.7,49.8,49.9,50,50.1,50.2,50.2,50.3,50.4,50.4,50.5,50.6,50.6,50.7,50.8,50.8,50.9,50.9,51,51,51.1,51.1,51.2,51.2,51.3,51.3,51.3],
                    '2': [36.2,38.9,40.7,42,43.1,44,44.8,45.5,46,46.5,46.9,47.3,47.6,47.9,48.2,48.4,48.6,48.8,49,49.2,49.4,49.5,49.7,49.8,50,50.1,50.3,50.4,50.5,50.6,50.7,50.9,51,51.1,51.2,51.2,51.3,51.4,51.5,51.6,51.7,51.7,51.8,51.9,51.9,52,52.1,52.1,52.2,52.2,52.3,52.3,52.4,52.4,52.5,52.5,52.6,52.6,52.7,52.7,52.8],
                    '3': [37.4,40.1,41.9,43.3,44.4,45.3,46.1,46.8,47.4,47.8,48.3,48.6,49,49.3,49.5,49.8,50,50.2,50.4,50.6,50.7,50.9,51.1,51.2,51.4,51.5,51.7,51.8,51.9,52,52.2,52.3,52.4,52.5,52.6,52.7,52.7,52.8,52.9,53,53.1,53.1,53.2,53.3,53.3,53.4,53.5,53.5,53.6,53.6,53.7,53.8,53.8,53.9,53.9,54,54,54.1,54.1,54.1,54.2],

                weight: [8, 9, 10] // Exemplo de z-scores de peso para meninos
            }
        }
    }
    
      }

    }

 ctx = this.circunferenciaCanvas.nativeElement.getContext('2d');

       const media = medias[gender][currentAgeInMonths];
       const desvioPadrao = desviosPadrao[gender][currentAgeInMonths];
    
    
        const zScore = this.calcularZScore(altura, media,  desvioPadrao);

        // Inicializa o array de dados com null
      
       // Adiciona o ponto atual
       data[currentAgeInMonths - 1] = altura;
       
       // Adiciona os dados históricos



  // Adiciona os dados históricos
if (this.listChatHistory && Array.isArray(this.listChatHistory)) {
    this.listChatHistory.forEach(item => {
        const ageInMonths = this.calculateAgeInMonthsD(item.dateService, this.calcularIdadeEmMeses(this.dataNascimento));
        data[ageInMonths - 1] = item.headSize;
    });
} 

    

//        const data = Array(totalMonths).fill(null).map((_, i) => (i === currentAgeInMonths - 1 ? altura : null));

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: totalMonths }, (_, i) => i + 1),
                datasets: [
                    {
                        label: 'Z-score -3',
                        data: this.zScores[gender].height['-3'],
                        borderColor: '#ff1000',
                        fill: false
                    },
                    {
                        label: 'Z-score -2',
                        data: this.zScores[gender].height['-2'],
                        borderColor: '#ff0000',
                        fill: false
                    },
                    {
                        label: 'Z-score -1',
                        data: this.zScores[gender].height['-1'],
                        borderColor: '#ff8000',
                        fill: false
                    },
                    {
                        label: 'Z-score 0',
                        data: this.zScores[gender].height['0'],
                        borderColor: '#ffff00',
                        fill: false
                    },
                    {
                        label: 'Z-score 1',
                        data: this.zScores[gender].height['1'],
                        borderColor: '#80ff00',
                        fill: false
                    },
                    {
                        label: 'Z-score 2',
                        data: this.zScores[gender].height['2'],
                        borderColor: '#00ff00',
                        fill: false
                    },
                    {
                        label: 'Z-score 3',
                        data: this.zScores[gender].height['3'],
                        borderColor: '#00ffff',
                        fill: false
                    },
                    {
                        label: type,
                        data: data,
                        borderColor: '#0000ff',
                        fill: false,
                        borderDash: [5, 5],
                        pointBackgroundColor: '#0000ff',
                        pointBorderColor: '#0000ff',
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: type
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: v_periodo
                        }
                    }]
                }
            }
        });
    
}

    createChart(gender, currentAgeInMonths,altura,peso,type) {

        const totalMonths = currentAgeInMonths+4; // Ajustado para 24 meses
        const height = altura; // Exemplo de altura em cm
        const weight = peso; // Exemplo de peso em kg


        if(type ==='Altura'){
            
            this.percentiles = {
                male: {
                    height: {
                        5:  [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.5, 75.7, 76.9, 78.0, 79.1, 80.2, 81.2, 82.2, 83.2, 84.2, 85.1, 86.0, 86.9, 87.8, 88.7, 89.6, 90.5, 91.4, 92.3, 93.2, 94.1, 95.0, 95.9, 96.8, 97.7, 98.6, 99.5, 100.4, 101.3, 102.2, 103.1, 104.0, 104.9, 105.8, 106.7, 107.6, 108.5, 109.4, 110.3, 111.2, 112.1, 113.0, 113.9, 114.8, 115.7, 116.6, 117.5, 118.4, 119.3, 120.2, 121.1],
                        25: [50.9, 55.7, 59.4, 62.4, 64.9, 66.9, 68.6, 70.2, 71.6, 73.0, 74.3, 75.5, 76.7, 77.9, 79.0, 80.1, 81.2, 82.2, 83.2, 84.2, 85.2, 86.1, 87.0, 87.9, 88.8, 89.7, 90.6, 91.5, 92.4, 93.3, 94.2, 95.1, 96.0, 96.9, 97.8, 98.7, 99.6, 100.5, 101.4, 102.3, 103.2, 104.1, 105.0, 105.9, 106.8, 107.7, 108.6, 109.5, 110.4, 111.3, 112.2, 113.1, 114.0, 114.9, 115.8, 116.7, 117.6, 118.5, 119.4, 120.3, 121.2, 122.1],
                        50: [51.9, 56.7, 60.4, 63.4, 65.9, 67.9, 69.6, 71.2, 72.6, 74.0, 75.3, 76.5, 77.7, 78.9, 80.0, 81.1, 82.2, 83.2, 84.2, 85.2, 86.2, 87.1, 88.0, 88.9, 89.8, 90.7, 91.6, 92.5, 93.4, 94.3, 95.2, 96.1, 97.0, 97.9, 98.8, 99.7, 100.6, 101.5, 102.4, 103.3, 104.2, 105.1, 106.0, 106.9, 107.8, 108.7, 109.6, 110.5, 111.4, 112.3, 113.2, 114.1, 115.0, 115.9, 116.8, 117.7, 118.6, 119.5, 120.4, 121.3, 122.2, 123.1],
                        75: [52.9, 57.7, 61.4, 64.4, 66.9, 68.9, 70.6, 72.2, 73.6, 75.0, 76.3, 77.5, 78.7, 79.9, 81.0, 82.1, 83.2, 84.2, 85.2, 86.2, 87.2, 88.1, 89.0, 89.9, 90.8, 91.7, 92.6, 93.5, 94.4, 95.3, 96.2, 97.1, 98.0, 98.9, 99.8, 100.7, 101.6, 102.5, 103.4, 104.3, 105.2, 106.1, 107.0, 107.9, 108.8, 109.7, 110.6, 111.5, 112.4, 113.3, 114.2, 115.1, 116.0, 116.9, 117.8, 118.7, 119.6, 120.5, 121.4, 122.3, 123.2, 124.1],
                        95: [53.9, 58.7, 62.4, 65.4, 67.9, 69.9, 71.6, 73.2, 74.6, 76.0, 77.3, 78.5, 79.7, 80.9, 82.0, 83.1, 84.2, 85.2, 86.2, 87.2, 88.2, 89.1, 90.0, 90.9, 91.8, 92.7, 93.6, 94.5, 95.4, 96.3, 97.2, 98.1, 99.0, 99.9, 100.8, 101.7, 102.6, 103.5, 104.4, 105.3, 106.2, 107.1, 108.0, 108.9, 109.8, 110.7, 111.6, 112.5, 113.4, 114.3, 115.2, 116.1, 117.0, 117.9, 118.8, 119.7, 120.6, 121.5, 122.4, 123.3, 124.2, 125.1]
                    },
                    weight: [8, 9, 10, 11, 12] // Exemplo de percentis de peso para meninos
                },
                female: {
                    height: {
                        5:  [49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.2, 68.6, 69.9, 71.1, 72.3, 73.4, 74.5, 75.6, 76.6, 77.6, 78.6, 79.5, 80.4, 81.3, 82.2, 83.0, 83.8, 84.6, 85.4, 86.2, 87.0, 87.8, 88.6, 89.4, 90.2, 91.0, 91.8, 92.6, 93.4, 94.2, 95.0, 95.8, 96.6, 97.4, 98.2, 99.0, 99.8, 100.6, 101.4, 102.2, 103.0, 103.8, 104.6, 105.4, 106.2, 107.0, 107.8, 108.6, 109.4, 110.2, 111.0, 111.8, 112.6, 113.4, 114.2],
                        25: [50.1, 54.7, 58.1, 60.8, 63.1, 65.0, 66.7, 68.2, 69.6, 70.9, 72.1, 73.3, 74.4, 75.5, 76.6, 77.6, 78.6, 79.6, 80.5, 81.4, 82.3, 83.2, 84.0, 84.8, 85.6, 86.4, 87.2, 88.0, 88.8, 89.6, 90.4, 91.2, 92.0, 92.8, 93.6, 94.4, 95.2, 96.0, 96.8, 97.6, 98.4, 99.2, 100.0, 100.8, 101.6, 102.4, 103.2, 104.0, 104.8, 105.6, 106.4, 107.2, 108.0, 108.8, 109.6, 110.4, 111.2, 112.0, 112.8, 113.6, 114.4, 115.2],
                        50: [51.1, 55.7, 59.1, 61.8, 64.1, 66.0, 67.7, 69.2, 70.6, 71.9, 73.1, 74.3, 75.4, 76.5, 77.6, 78.6, 79.6, 80.6, 81.5, 82.4, 83.3, 84.2, 85.0, 85.8, 86.6, 87.4, 88.2, 89.0, 89.8, 90.6, 91.4, 92.2, 93.0, 93.8, 94.6, 95.4, 96.2, 97.0, 97.8, 98.6, 99.4, 100.2, 101.0, 101.8, 102.6, 103.4, 104.2, 105.0, 105.8, 106.6, 107.4, 108.2, 109.0, 109.8, 110.6, 111.4, 112.2, 113.0, 113.8, 114.6, 115.4, 116.2],
                        75: [52.1, 56.7, 60.1, 62.8, 65.1, 67.0, 68.7, 70.2, 71.6, 72.9, 74.1, 75.3, 76.4, 77.5, 78.6, 79.6, 80.6, 81.6, 82.5, 83.4, 84.3, 85.2, 86.0, 86.8, 87.6, 88.4, 89.2, 90.0, 90.8, 91.6, 92.4, 93.2, 94.0, 94.8, 95.6, 96.4, 97.2, 98.0, 98.8, 99.6, 100.4, 101.2, 102.0, 102.8, 103.6, 104.4, 105.2, 106.0, 106.8, 107.6, 108.4, 109.2, 110.0, 110.8, 111.6, 112.4, 113.2, 114.0, 114.8, 115.6, 116.4, 117.2],
                        95: [53.1, 57.7, 61.1, 63.8, 66.1, 68.0, 69.7, 71.2, 72.6, 73.9, 75.1, 76.3, 77.4, 78.5, 79.6, 80.6, 81.6, 82.6, 83.5, 84.4, 85.3, 86.2, 87.0, 87.8, 88.6, 89.4, 90.2, 91.0, 91.8, 92.6, 93.4, 94.2, 95.0, 95.8, 96.6, 97.4, 98.2, 99.0, 99.8, 100.6, 101.4, 102.2, 103.0, 103.8, 104.6, 105.4, 106.2, 107.0, 107.8, 108.6, 109.4, 110.2, 111.0, 111.8, 112.6, 113.4, 114.2, 115.0, 115.8, 116.6, 117.4, 118.2]
                    },
                    weight: [8, 9, 10, 11, 12] // Exemplo de percentis de peso para meninas
                }
            };
            
    }else{
        this.percentiles = {
            male: {
                height: {
                    5:  [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6, 9.8, 10.0, 10.2, 10.4, 10.5, 10.7, 10.8, 11.0, 11.1, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 12.0, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 13.0, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 14.0, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 15.0],
                    25: [3.6, 4.8, 5.9, 6.7, 7.3, 7.8, 8.2, 8.6, 8.9, 9.2, 9.5, 9.7, 9.9, 10.1, 10.3, 10.5, 10.7, 10.8, 11.0, 11.1, 11.3, 11.4, 11.6, 11.7, 11.8, 11.9, 12.0, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 13.0, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 14.0, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 15.0, 15.1, 15.2, 15.3],
                    50: [3.9, 5.1, 6.2, 7.0, 7.6, 8.1, 8.5, 8.9, 9.2, 9.5, 9.8, 10.0, 10.2, 10.4, 10.6, 10.8, 11.0, 11.1, 11.3, 11.4, 11.6, 11.7, 11.9, 12.0, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 13.0, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 14.0, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 15.0, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6],
                    75: [4.2, 5.4, 6.5, 7.3, 7.9, 8.4, 8.8, 9.2, 9.5, 9.8, 10.1, 10.3, 10.5, 10.7, 10.9, 11.1, 11.3, 11.4, 11.6, 11.7, 11.9, 12.0, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 13.0, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 14.0, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 15.0, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9],
                    95: [4.5, 5.7, 6.8, 7.6, 8.2, 8.7, 9.1, 9.5, 9.8, 10.1, 10.4, 10.6, 10.8, 11.0, 11.2, 11.4, 11.6, 11.7, 11.9, 12.0, 12.2, 12.3, 12.5, 12.6, 12.7, 12.8, 12.9, 13.0, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 14.0, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 15.0, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 16.0, 16.1, 16.2]

                },                weight: [8, 9, 10, 11, 12] // Exemplo de percentis de peso para meninos

            },
            female: {
                height: {
                    5:  [3.2, 4.4, 5.5, 6.3, 6.9, 7.4, 7.8, 8.2, 8.5, 8.8, 9.1, 9.3, 9.5, 9.7, 9.9, 10.1, 10.3, 10.4, 10.6, 10.7, 10.9, 11.0, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 12.0, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 13.0, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 14.0, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 15.0],
            25: [3.5, 4.7, 5.8, 6.6, 7.2, 7.7, 8.1, 8.5, 8.8, 9.1, 9.4, 9.6, 9.8, 10.0, 10.2, 10.4, 10.6, 10.7, 10.9, 11.0, 11.2, 11.3, 11.5, 11.6, 11.7, 11.8, 11.9, 12.0, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 13.0, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 14.0, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 15.0, 15.1, 15.2, 15.3],
            50: [3.8, 5.0, 6.1, 6.9, 7.5, 8.0, 8.4, 8.8, 9.1, 9.4, 9.7, 9.9, 10.1, 10.3, 10.5, 10.7, 10.9, 11.0, 11.2, 11.3, 11.5, 11.6, 11.8, 11.9, 12.0, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 13.0, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 14.0, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 15.0, 15.1, 15.2, 15.3, 15.4, 15.5],
            75: [4.1, 5.3, 6.4, 7.2, 7.8, 8.3, 8.7, 9.1, 9.4, 9.7, 10.0, 10.2, 10.4, 10.6, 10.8, 11.0, 11.2, 11.3, 11.5, 11.6, 11.8, 11.9, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 13.0, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 14.0, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 15.0, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8],
            95: [4.4, 5.6, 6.7, 7.5, 8.1, 8.6, 9.0, 9.4, 9.7, 10.0, 10.3, 10.5, 10.7, 10.9, 11.1, 11.3, 11.5, 11.6, 11.8, 11.9, 12.1, 12.2, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 13.0, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 14.0, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 15.0, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 16.0, 16.1]
                },
                weight: [8, 9, 10, 11, 12] // Exemplo de percentis de peso para meninas

            }
        };

    }

        
        const growthData = this.calculateGrowth(currentAgeInMonths, height, weight, gender);


        if(type ==='Altura'){

            const ctx = this.heightChartCanvas.nativeElement.getContext('2d');
    
            new Chart(ctx, {
                type: 'line',
            data: {
                labels: Array.from({ length: totalMonths }, (_, i) => i + 1),
                datasets: [
                    {
                        label: 'Percentil 5',
                        data: this.percentiles[gender].height[5],
                        borderColor: '#ff0000',
                        fill: false
                    },
                    {
                        label: 'Percentil 25',
                        data: this.percentiles[gender].height[25],
                        borderColor: '#ff8000',
                        fill: false
                    },
                    {
                        label: 'Percentil 50',
                        data: this.percentiles[gender].height[50],
                        borderColor: '#ffff00',
                        fill: false
                    },
                    {
                        label: 'Percentil 75',
                        data: this.percentiles[gender].height[75],
                        borderColor: '#80ff00',
                        fill: false
                    },
                    {
                        label: 'Percentil 95',
                        data: this.percentiles[gender].height[95],
                        borderColor: '#00ff00',
                        fill: false
                    },
                    {
                        label: 'Altura da Criança',
                        data: Array(totalMonths).fill(null).map((_, i) => (i === currentAgeInMonths - 1 ? height : null)),
                        borderColor: '#0000ff',
                        fill: false,
                        borderDash: [5, 5],
                        pointBackgroundColor: '#0000ff',
                        pointBorderColor: '#0000ff',
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Gráfico de Crescimento'
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Idade (meses)'
                        },
                        ticks: {
                            maxTicksLimit: 12
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Altura (cm)'
                        },
                        ticks: {
                            min: 49,
                            max: 92,
                            stepSize: 15
                        }
                    }]
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutBounce'
                },
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'xy'
                        },
                        zoom: {
                            enabled: true,
                            mode: 'xy'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Percentil ${context.dataset.label}: ${context.raw}`;
                            }
                        }
                    }
                }
            } 
            
        });
    }else{

        const ctx = this.pesoChartCanvas.nativeElement.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: totalMonths }, (_, i) => i + 1),
                datasets: [
                    {
                        label: 'Percentil 5',
                        data: this.percentiles[gender].height[5],
                        borderColor: '#ff0000',
                        fill: false
                    },
                    {
                        label: 'Percentil 25',
                        data: this.percentiles[gender].height[25],
                        borderColor: '#ff8000',
                        fill: false
                    },
                    {
                        label: 'Percentil 50',
                        data: this.percentiles[gender].height[50],
                        borderColor: '#ffff00',
                        fill: false
                    },
                    {
                        label: 'Percentil 75',
                        data: this.percentiles[gender].height[75],
                        borderColor: '#80ff00',
                        fill: false
                    },
                    {
                        label: 'Percentil 95',
                        data: this.percentiles[gender].height[95],
                        borderColor: '#00ff00',
                        fill: false
                    },
                    {
                        label: 'Peso da Criança',
                        data: Array(totalMonths).fill(null).map((_, i) => (i === currentAgeInMonths - 1 ? weight : null)),
                        borderColor: '#0000ff',
                        fill: false,
                        borderDash: [5, 5],
                        pointBackgroundColor: '#0000ff',
                        pointBorderColor: '#0000ff',
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Gráfico de Peso'
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Idade (meses)'
                        },
                        ticks: {
                            maxTicksLimit: 12 // Ajuste este valor conforme necessário
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Peso (cm)'
                        },
                        ticks: {
                            min: 1, // Defina o valor mínimo do eixo Y
                            max: 13, // Defina o valor máximo do eixo Y
                            stepSize: 1 // Ajuste este valor para aumentar o espaçamento entre os valores do eixo Y
                        }
                    }]
                }
            }
            
            
            
        });
    }
    }
    
     calcularZScore(altura, media, desvioPadrao) {
        return (altura - media) / desvioPadrao;
    }

    createHeightChart(gender, currentAgeInMonths, altura,type) {

        const totalMonths = currentAgeInMonths + 4; // Ajustado para 24 meses

        var v_periodo ='Idade (meses)';

        // Inicializa o array de dados com null
       const data = Array(totalMonths).fill(null);

        var medias = null;
        var desviosPadrao = null;
        var ctx = null;

      if(type =='Peso'){ // calculo de peso

        medias = {
            male: [
                3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6, 9.9, 10.1, 10.3, 10.5, 10.7, 10.9, 11.1, 11.3, 11.5, 11.7, 11.9, 12.1, 12.3, 12.5, 12.7, 12.9, 13.1, 13.3, 13.5, 13.7, 13.9, 14.1, 14.3, 14.5, 14.7, 14.9, 15.1, 15.3, 15.5, 15.7, 15.9, 16.1, 16.3, 16.5, 16.7, 16.9, 17.1, 17.3, 17.5, 17.7, 17.9, 18.1, 18.3, 18.5, 18.7, 18.9, 19.1, 19.3
            ],
            female: [
                3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 7.9, 8.2, 8.5, 8.7, 8.9, 9.1, 9.3, 9.5, 9.7, 9.9, 10.1, 10.3, 10.5, 10.7, 10.9, 11.1, 11.3, 11.5, 11.7, 11.9, 12.1, 12.3, 12.5, 12.7, 12.9, 13.1, 13.3, 13.5, 13.7, 13.9, 14.1, 14.3, 14.5, 14.7, 14.9, 15.1, 15.3, 15.5, 15.7, 15.9, 16.1, 16.3, 16.5, 16.7, 16.9, 17.1, 17.3, 17.5, 17.7, 17.9, 18.1, 18.3, 18.5
            ]
        };

         desviosPadrao = {
            male: [
                0.5, 0.6, 0.7, 0.8, 0.9, 0.9, 1.0, 1.0, 1.1, 1.1, 1.2, 1.2, 1.3, 1.3, 1.4, 1.4, 1.5, 1.5, 1.6, 1.6, 1.7, 1.7, 1.8, 1.8, 1.9, 1.9, 2.0, 2.0, 2.1, 2.1, 2.2, 2.2, 2.3, 2.3, 2.4, 2.4, 2.5, 2.5, 2.6, 2.6, 2.7, 2.7, 2.8, 2.8, 2.9, 2.9, 3.0, 3.0, 3.1, 3.1, 3.2, 3.2, 3.3, 3.3, 3.4, 3.4, 3.5, 3.5, 3.6, 3.6, 3.7
            ],
            female: [
                0.5, 0.6, 0.7, 0.8, 0.9, 0.9, 1.0, 1.0, 1.1, 1.1, 1.2, 1.2, 1.3, 1.3, 1.4, 1.4, 1.5, 1.5, 1.6, 1.6, 1.7, 1.7, 1.8, 1.8, 1.9, 1.9, 2.0, 2.0, 2.1, 2.1, 2.2, 2.2, 2.3, 2.3, 2.4, 2.4, 2.5, 2.5, 2.6, 2.6, 2.7, 2.7, 2.8, 2.8, 2.9, 2.9, 3.0, 3.0, 3.1, 3.1, 3.2, 3.2, 3.3, 3.3, 3.4, 3.4, 3.5, 3.5, 3.6, 3.6, 3.7
            ]
        };

        if(currentAgeInMonths<=13)
        {

            this.zScores = {
                male: {
                    height: {
                        '-3': [2.1,2.2,2.4,2.6,2.9,3.1,3.3,3.5,3.7,3.8,4,4.2,4.3,4.4],
                        '-2': [2.5,2.6,2.8,3.1,3.3,3.5,3.8,4,4.2,4.4,4.5,4.7,4.9,5],
                        '-1': [2.9,3,3.2,3.5,3.8,4.1,4.3,4.6,4.8,5,5.2,5.3,5.5,5.7],
                        '0': [3.3,3.5,3.8,4.1,4.4,4.7,4.9,5.2,5.4,5.6,5.8,6,6.2,6.4],
                        '1': [3.9,4,4.3,4.7,5,5.3,5.6,5.9,6.1,6.4,6.6,6.8,7,7.2],
                        '2': [4.4,4.6,4.9,5.3,5.7,6,6.3,6.6,6.9,7.2,7.4,7.6,7.8,8] ,
                        '3': [5,5.3,5.6,6,6.4,6.8,7.2,7.5,7.8,8,8.3,8.5,8.8,9] ,
            },
                    weight: [8, 9, 10] // Exemplo de z-scores de peso para meninos
                },
                    female: {
                        '-3': [2,2.1,2.3,2.5,2.7,2.9,3,3.2,3.3,3.5,3.6,3.8,3.9,4],
                        '-2': [2.4,2.5,2.7,2.9,3.1,3.3,3.5,3.7,3.8,4,4.1,4.3,4.4,4.5],
                        '-1': [2.8,2.9,3.1,3.3,3.6,3.8,4,4.2,4.4,4.6,4.7,4.9,5,5.1],
                        '0': [3.2,3.3,3.6,3.8,4.1,4.3,4.6,4.8,5,5.2,5.4,5.5,5.7,5.8],
                        '1': [3.7,3.9,4.1,4.4,4.7,5,5.2,5.5,5.7,5.9,6.1,6.3,6.5,6.6],
                        '2': [4.2,4.4,4.7,5,5.4,5.7,6,6.2,6.5,6.7,6.9,7.1,7.3,7.5] ,
                        '3': [4.8,5.1,5.4,5.7,6.1,6.5,6.8,7.1,7.3,7.6,7.8,8.1,8.3,8.5] ,
            },   weight: [7, 8, 9] // Exemplo de z-scores de peso para meninas
                
            };

            v_periodo ='Idade (Semanas)';

        }else{

            this.zScores = {
                male: {
                    height: {
                        '-3': [2.1,2.9,3.8,4.4,4.9,5.3,5.7,5.9,6.2,6.4,6.6,6.8,6.9,7.1,7.2,7.4,7.5,7.7,7.8,8,8.1,8.2,8.4,8.5,8.6,8.8,8.9,9,9.1,9.2,9.4,9.5,9.6,9.7,9.8,9.9,10,10.1,10.2,10.3,10.4,10.5,10.6,10.7,10.8,10.9,11,11.1,11.2,11.3,11.4,11.5,11.6,11.7,11.8,11.9,12,12.1,12.2,12.3,12.4],
                        '-2': [2.5,3.4,4.3,5,5.6,6,6.4,6.7,6.9,7.1,7.4,7.6,7.7,7.9,8.1,8.3,8.4,8.6,8.8,8.9,9.1,9.2,9.4,9.5,9.7,9.8,10,10.1,10.2,10.4,10.5,10.7,10.8,10.9,11,11.2,11.3,11.4,11.5,11.6,11.8,11.9,12,12.1,12.2,12.4,12.5,12.6,12.7,12.8,12.9,13.1,13.2,13.3,13.4,13.5,13.6,13.7,13.8,14,14.1],
                        '-1': [2.9,3.9,4.9,5.7,6.2,6.7,7.1,7.4,7.7,8,8.2,8.4,8.6,8.8,9,9.2,9.4,9.6,9.8,10,10.1,10.3,10.5,10.7,10.8,11,11.2,11.3,11.5,11.7,11.8,12,12.1,12.3,12.4,12.6,12.7,12.9,13,13.1,13.3,13.4,13.6,13.7,13.8,14,14.1,14.3,14.4,14.5,14.7,14.8,15,15.1,15.2,15.4,15.5,15.6,15.8,15.9,16],
                        '0': [3.3,4.5,5.6,6.4,7,7.5,7.9,8.3,8.6,8.9,9.2,9.4,9.6,9.9,10.1,10.3,10.5,10.7,10.9,11.1,11.3,11.5,11.8,12,12.2,12.4,12.5,12.7,12.9,13.1,13.3,13.5,13.7,13.8,14,14.2,14.3,14.5,14.7,14.8,15,15.2,15.3,15.5,15.7,15.8,16,16.2,16.3,16.5,16.7,16.8,17,17.2,17.3,17.5,17.7,17.8,18,18.2,18.3],
                        '1': [3.9,5.1,6.3,7.2,7.8,8.4,8.8,9.2,9.6,9.9,10.2,10.5,10.8,11,11.3,11.5,11.7,12,12.2,12.5,12.7,12.9,13.2,13.4,13.6,13.9,14.1,14.3,14.5,14.8,15,15.2,15.4,15.6,15.8,16,16.2,16.4,16.6,16.8,17,17.2,17.4,17.6,17.8,18,18.2,18.4,18.6,18.8,19,19.2,19.4,19.6,19.8,20,20.2,20.4,20.6,20.8,21],
                        '2': [4.4,5.8,7.1,8,8.7,9.3,9.8,10.3,10.7,11,11.4,11.7,12,12.3,12.6,12.8,13.1,13.4,13.7,13.9,14.2,14.5,14.7,15,15.3,15.5,15.8,16.1,16.3,16.6,16.9,17.1,17.4,17.6,17.8,18.1,18.3,18.6,18.8,19,19.3,19.5,19.7,20,20.2,20.5,20.7,20.9,21.2,21.4,21.7,21.9,22.2,22.4,22.7,22.9,23.2,23.4,23.7,23.9,24.2] ,
                        '3': [5,6.6,8,9,9.7,10.4,10.9,11.4,11.9,12.3,12.7,13,13.3,13.7,14,14.3,14.6,14.9,15.3,15.6,15.9,16.2,16.5,16.8,17.1,17.5,17.8,18.1,18.4,18.7,19,19.3,19.6,19.9,20.2,20.4,20.7,21,21.3,21.6,21.9,22.1,22.4,22.7,23,23.3,23.6,23.9,24.2,24.5,24.8,25.1,25.4,25.7,26,26.3,26.6,26.9,27.2,27.6,27.9] ,
            },
                    weight: [8, 9, 10] // Exemplo de z-scores de peso para meninos
                },
                    female: {
                        '-3': [2,2.7,3.4,4,4.4,4.8,5.1,5.3,5.6,5.8,5.9,6.1,6.3,6.4,6.6,6.7,6.9,7,7.2,7.3,7.5,7.6,7.8,7.9,8.1,8.2,8.4,8.5,8.6,8.8,8.9,9,9.1,9.3,9.4,9.5,9.6,9.7,9.8,9.9,10.1,10.2,10.3,10.4,10.5,10.6,10.7,10.8,10.9,11,11.1,11.2,11.3,11.4,11.5,11.6,11.7,11.8,11.9,12,12.1],
                        '-2': [2.4,3.2,3.9,4.5,5,5.4,5.7,6,6.3,6.5,6.7,6.9,7,7.2,7.4,7.6,7.7,7.9,8.1,8.2,8.4,8.6,8.7,8.9,9,9.2,9.4,9.5,9.7,9.8,10,10.1,10.3,10.4,10.5,10.7,10.8,10.9,11.1,11.2,11.3,11.5,11.6,11.7,11.8,12,12.1,12.2,12.3,12.4,12.6,12.7,12.8,12.9,13,13.2,13.3,13.4,13.5,13.6,13.7],
                        '-1': [2.8,3.6,4.5,5.2,5.7,6.1,6.5,6.8,7,7.3,7.5,7.7,7.9,8.1,8.3,8.5,8.7,8.9,9.1,9.2,9.4,9.6,9.8,10,10.2,10.3,10.5,10.7,10.9,11.1,11.2,11.4,11.6,11.7,11.9,12,12.2,12.4,12.5,12.7,12.8,13,13.1,13.3,13.4,13.6,13.7,13.9,14,14.2,14.3,14.5,14.6,14.8,14.9,15.1,15.2,15.3,15.5,15.6,15.8],
                        '0': [3.2,4.2,5.1,5.8,6.4,6.9,7.3,7.6,7.9,8.2,8.5,8.7,8.9,9.2,9.4,9.6,9.8,10,10.2,10.4,10.6,10.9,11.1,11.3,11.5,11.7,11.9,12.1,12.3,12.5,12.7,12.9,13.1,13.3,13.5,13.7,13.9,14,14.2,14.4,14.6,14.8,15,15.2,15.3,15.5,15.7,15.9,16.1,16.3,16.4,16.6,16.8,17,17.2,17.3,17.5,17.7,17.9,18,18.2],
                        '1': [3.7,4.8,5.8,6.6,7.3,7.8,8.2,8.6,9,9.3,9.6,9.9,10.1,10.4,10.6,10.9,11.1,11.4,11.6,11.8,12.1,12.3,12.5,12.8,13,13.3,13.5,13.7,14,14.2,14.4,14.7,14.9,15.1,15.4,15.6,15.8,16,16.3,16.5,16.7,16.9,17.2,17.4,17.6,17.8,18.1,18.3,18.5,18.8,19,19.2,19.4,19.7,19.9,20.1,20.3,20.6,20.8,21,21.2],
                        '2': [4.2,5.5,6.6,7.5,8.2,8.8,9.3,9.8,10.2,10.5,10.9,11.2,11.5,11.8,12.1,12.4,12.6,12.9,13.2,13.5,13.7,14,14.3,14.6,14.8,15.1,15.4,15.7,16,16.2,16.5,16.8,17.1,17.3,17.6,17.9,18.1,18.4,18.7,19,19.2,19.5,19.8,20.1,20.4,20.7,20.9,21.2,21.5,21.8,22.1,22.4,22.6,22.9,23.2,23.5,23.8,24.1,24.4,24.6,24.9] ,
                        '3': [4.8,6.2,7.5,8.5,9.3,10,10.6,11.1,11.6,12,12.4,12.8,13.1,13.5,13.8,14.1,14.5,14.8,15.1,15.4,15.7,16,16.4,16.7,17,17.3,17.7,18,18.3,18.7,19,19.3,19.6,20,20.3,20.6,20.9,21.3,21.6,22,22.3,22.7,23,23.4,23.7,24.1,24.5,24.8,25.2,25.5,25.9,26.3,26.6,27,27.4,27.7,28.1,28.5,28.8,29.2,29.5] ,
            },   weight: [7, 8, 9] // Exemplo de z-scores de peso para meninas
                
            };

        }



        ctx = this.weightZChartCanvas.nativeElement.getContext('2d');


       // Inicializa o array de dados com null

       // Adiciona o ponto atual
       data[currentAgeInMonths - 1] = altura;
       
       // Adiciona os dados históricos


// Adiciona os dados históricos
if (this.listChatHistory && Array.isArray(this.listChatHistory)) {
    this.listChatHistory.forEach(item => {
        const ageInMonths = this.calculateAgeInMonthsD(item.dateService, this.calcularIdadeEmMeses(this.dataNascimento));
        data[ageInMonths - 1] = item.weight;
    });
} 


             

      }else{ // calculo de altura

            
        // Dados da OMS para meninos e meninas
         medias = {
            male: [
                49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.5, 75.7, 76.9, 78.0, 79.1, 80.2, 81.2, 82.3, 83.2, 84.2, 85.1, 86.0, 86.9, 87.8, 88.7, 89.6, 90.4, 91.3, 92.1, 92.9, 93.7, 94.5, 95.3, 96.1, 96.9, 97.6, 98.4, 99.1, 99.8, 100.5, 101.2, 101.9, 102.6, 103.3, 104.0, 104.6, 105.3, 105.9, 106.5, 107.2, 107.8, 108.4, 109.0, 109.6, 110.2, 110.8, 111.4, 112.0, 112.6, 113.2
            ],
            female: [
                49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.3, 68.7, 70.1, 71.5, 72.8, 74.0, 75.2, 76.4, 77.5, 78.6, 79.7, 80.7, 81.7, 82.7, 83.7, 84.6, 85.5, 86.4, 87.3, 88.2, 89.0, 89.9, 90.7, 91.5, 92.3, 93.1, 93.9, 94.7, 95.4, 96.2, 96.9, 97.6, 98.4, 99.1, 99.8, 100.5, 101.2, 101.9, 102.6, 103.3, 104.0, 104.6, 105.3, 105.9, 106.5, 107.2, 107.8, 108.4, 109.0, 109.6, 110.2, 110.8, 111.4, 112.0
            ]
        };

         desviosPadrao = {
            male: [
                1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9
            ],
            female: [
                1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8
            ]
        };

        if(currentAgeInMonths<=13)
            {
    
                this.zScores = {
                    male: {
                        height: {
                            '-3': [44.2,45.4,46.6,47.6,48.6,49.5,50.3,51.1,51.9,52.6,53.3,54,54.7,55.3],
                            '-2': [46.1,47.3,48.5,49.5,50.5,51.4,52.3,53.1,53.9,54.6,55.4,56,56.7,57.3],
                            '-1': [48,49.2,50.4,51.5,52.4,53.4,54.3,55.1,55.9,56.6,57.4,58.1,58.7,59.4],
                            '0': [49.9,51.1,52.3,53.4,54.4,55.3,56.2,57.1,57.9,58.7,59.4,60.1,60.8,61.4],
                            '1': [51.8,53,54.3,55.3,56.3,57.3,58.2,59.1,59.9,60.7,61.4,62.1,62.8,63.4],
                            '2': [53.7,54.9,56.2,57.2,58.3,59.2,60.2,61,61.9,62.7,63.4,64.1,64.8,65.5] ,
                            '3': [55.6,56.8,58.1,59.2,60.2,61.2,62.1,63,63.9,64.7,65.4,66.2,66.9,67.5] ,
                },
                        weight: [8, 9, 10] // Exemplo de z-scores de peso para meninos
                    },  
                        female: {
                            '-3': [43.6,44.7,45.8,46.7,47.5,48.3,49.1,49.8,50.5,51.2,51.8,52.4,52.9,53.5],
                            '-2': [45.4,46.6,47.7,48.6,49.5,50.3,51.1,51.8,52.5,53.2,53.8,54.4,55,55.6],
                            '-1': [47.3,48.4,49.6,50.5,51.4,52.3,53.1,53.8,54.6,55.2,55.9,56.5,57.1,57.7],
                            '0': [49.1,50.3,51.5,52.5,53.4,54.2,55.1,55.8,56.6,57.3,57.9,58.6,59.2,59.8],
                            '1': [51,52.2,53.4,54.4,55.3,56.2,57.1,57.8,58.6,59.3,60,60.7,61.3,61.9],
                            '2': [52.9,54.1,55.3,56.3,57.3,58.2,59,59.9,60.6,61.4,62.1,62.7,63.4,64] ,
                            '3': [54.7,56,57.2,58.2,59.2,60.1,61,61.9,62.6,63.4,64.1,64.8,65.5,66.1] ,
                },   weight: [7, 8, 9] // Exemplo de z-scores de peso para meninas
                    
                };
    
                v_periodo ='Idade (Semanas)';
    
            }else{

        this.zScores = {
                male: {
                height: {
             '-3': [44.2,48.9,52.4,55.3,57.6,59.6,61.2,62.7,64,65.2,66.4,67.6,68.6,69.6,70.6,71.6,72.5,73.3,74.2,75,75.8,76.5,77.2,78,78.7,78.6,79.3,79.9,80.5,81.1,81.7,82.3,82.8,83.4,83.9,84.4,85,85.5,86,86.5,87,87.5,88,88.4,88.9,89.4,89.8,90.3,90.7,91.2,91.6,92.1,92.5,93,93.4,93.9,94.3,94.7,95.2,95.6,96.1],
             '-2': [46.1,50.8,54.4,57.3,59.7,61.7,63.3,64.8,66.2,67.5,68.7,69.9,71,72.1,73.1,74.1,75,76,76.9,77.7,78.6,79.4,80.2,81,81.7,81.7,82.5,83.1,83.8,84.5,85.1,85.7,86.4,86.9,87.5,88.1,88.7,89.2,89.8,90.3,90.9,91.4,91.9,92.4,93,93.5,94,94.4,94.9,95.4,95.9,96.4,96.9,97.4,97.8,98.3,98.8,99.3,99.7,100.2,100.7],
             '-1': [48,52.8,56.4,59.4,61.8,63.8,65.5,67,68.4,69.7,71,72.2,73.4,74.5,75.6,76.6,77.6,78.6,79.6,80.5,81.4,82.3,83.1,83.9,84.8,84.9,85.6,86.4,87.1,87.8,88.5,89.2,89.9,90.5,91.1,91.8,92.4,93,93.6,94.2,94.7,95.3,95.9,96.4,97,97.5,98.1,98.6,99.1,99.7,100.2,100.7,101.2,101.7,102.3,102.8,103.3,103.8,104.3,104.8,105.3],
             '0': [49.9,54.7,58.4,61.4,63.9,65.9,67.6,69.2,70.6,72,73.3,74.5,75.7,76.9,78,79.1,80.2,81.2,82.3,83.2,84.2,85.1,86,86.9,87.8,88,88.8,89.6,90.4,91.2,91.9,92.7,93.4,94.1,94.8,95.4,96.1,96.7,97.4,98,98.6,99.2,99.9,100.4,101,101.6,102.2,102.8,103.3,103.9,104.4,105,105.6,106.1,106.7,107.2,107.8,108.3,108.9,109.4,110],
             '1': [51.8,56.7,60.4,63.5,66,68,69.8,71.3,72.8,74.2,75.6,76.9,78.1,79.3,80.5,81.7,82.8,83.9,85,86,87,88,89,89.9,90.9,91.1,92,92.9,93.7,94.5,95.3,96.1,96.9,97.6,98.4,99.1,99.8,100.5,101.2,101.8,102.5,103.2,103.8,104.5,105.1,105.7,106.3,106.9,107.5,108.1,108.7,109.3,109.9,110.5,111.1,111.7,112.3,112.8,113.4,114,114.6],
             '2': [53.7,58.6,62.4,65.5,68,70.1,71.9,73.5,75,76.5,77.9,79.2,80.5,81.8,83,84.2,85.4,86.5,87.7,88.8,89.8,90.9,91.9,92.9,93.9,94.2,95.2,96.1,97,97.9,98.7,99.6,100.4,101.2,102,102.7,103.5,104.2,105,105.7,106.4,107.1,107.8,108.5,109.1,109.8,110.4,111.1,111.7,112.4,113,113.6,114.2,114.9,115.5,116.1,116.7,117.4,118,118.6,119.2] ,
             '3': [55.6,60.6,64.4,67.6,70.1,72.2,74,75.7,77.2,78.7,80.1,81.5,82.9,84.2,85.5,86.7,88,89.2,90.4,91.5,92.6,93.8,94.9,95.9,97,97.3,98.3,99.3,100.3,101.2,102.1,103,103.9,104.8,105.6,106.4,107.2,108,108.8,109.5,110.3,111,111.7,112.5,113.2,113.9,114.6,115.2,115.9,116.6,117.3,117.9,118.6,119.2,119.9,120.6,121.2,121.9,122.6,123.2,123.9] ,

             weight: [8, 9, 10] // Exemplo de z-scores de peso para meninos
            },
                female: {
                height: {
                    '-3': [43.6,47.8,51,53.5,55.6,57.4,58.9,60.3,61.7,62.9,64.1,65.2,66.3,67.3,68.3,69.3,70.2,71.1,72,72.8,73.7,74.5,75.2,76,76.7,76.8,77.5,78.1,78.8,79.5,80.1,80.7,81.3,81.9,82.5,83.1,83.6,84.2,84.7,85.3,85.8,86.3,86.8,87.4,87.9,88.4,88.9,89.3,89.8,90.3,90.7,91.2,91.7,92.1,92.6,93,93.4,93.9,94.3,94.7,95.2],
                    '-2': [45.4,49.8,53,55.6,57.8,59.6,61.2,62.7,64,65.3,66.5,67.7,68.9,70,71,72,73,74,74.9,75.8,76.7,77.5,78.4,79.2,80,80,80.8,81.5,82.2,82.9,83.6,84.3,84.9,85.6,86.2,86.8,87.4,88,88.6,89.2,89.8,90.4,90.9,91.5,92,92.5,93.1,93.6,94.1,94.6,95.1,95.6,96.1,96.6,97.1,97.6,98.1,98.5,99,99.5,99.9],
                    '-1': [47.3,51.7,55,57.7,59.9,61.8,63.5,65,66.4,67.7,69,70.3,71.4,72.6,73.7,74.8,75.8,76.8,77.8,78.8,79.7,80.6,81.5,82.3,83.2,83.3,84.1,84.9,85.7,86.4,87.1,87.9,88.6,89.3,89.9,90.6,91.2,91.9,92.5,93.1,93.8,94.4,95,95.6,96.2,96.7,97.3,97.9,98.4,99,99.5,100.1,100.6,101.1,101.6,102.2,102.7,103.2,103.7,104.2,104.7],
                    '0': [49.1,53.7,57.1,59.8,62.1,64,65.7,67.3,68.7,70.1,71.5,72.8,74,75.2,76.4,77.5,78.6,79.7,80.7,81.7,82.7,83.7,84.6,85.5,86.4,86.6,87.4,88.3,89.1,89.9,90.7,91.4,92.2,92.9,93.6,94.4,95.1,95.7,96.4,97.1,97.7,98.4,99,99.7,100.3,100.9,101.5,102.1,102.7,103.3,103.9,104.5,105,105.6,106.2,106.7,107.3,107.8,108.4,108.9,109.4],
                    '1': [51,55.6,59.1,61.9,64.3,66.2,68,69.6,71.1,72.6,73.9,75.3,76.6,77.8,79.1,80.2,81.4,82.5,83.6,84.7,85.7,86.7,87.7,88.7,89.6,89.9,90.8,91.7,92.5,93.4,94.2,95,95.8,96.6,97.4,98.1,98.9,99.6,100.3,101,101.7,102.4,103.1,103.8,104.5,105.1,105.8,106.4,107,107.7,108.3,108.9,109.5,110.1,110.7,111.3,111.9,112.5,113,113.6,114.2],
                    '2': [52.9,57.6,61.1,64,66.4,68.5,70.3,71.9,73.5,75,76.4,77.8,79.2,80.5,81.7,83,84.2,85.4,86.5,87.6,88.7,89.8,90.8,91.9,92.9,93.1,94.1,95,96,96.9,97.7,98.6,99.4,100.3,101.1,101.9,102.7,103.4,104.2,105,105.7,106.4,107.2,107.9,108.6,109.3,110,110.7,111.3,112,112.7,113.3,114,114.6,115.2,115.9,116.5,117.1,117.7,118.3,118.9] ,
                    '3': [54.7,59.5,63.2,66.1,68.6,70.7,72.5,74.2,75.8,77.4,78.9,80.3,81.7,83.1,84.4,85.7,87,88.2,89.4,90.6,91.7,92.9,94,95,96.1,96.4,97.4,98.4,99.4,100.3,101.3,102.2,103.1,103.9,104.8,105.6,106.5,107.3,108.1,108.9,109.7,110.5,111.2,112,112.7,113.5,114.2,114.9,115.7,116.4,117.1,117.7,118.4,119.1,119.8,120.4,121.1,121.8,122.4,123.1,123.7] ,
         weight: [8, 9, 10] // Exemplo de z-scores de peso para meninos
            }
        }
    }
    
}
            }
 ctx = this.heightZChartCanvas.nativeElement.getContext('2d');

      
       // Adiciona o ponto atual
       data[currentAgeInMonths - 1] = altura;
       
    // Adiciona os dados históricos
    if (this.listChatHistory && Array.isArray(this.listChatHistory)) {
        this.listChatHistory.forEach(item => {
            const ageInMonths = this.calculateAgeInMonthsD(item.dateService, this.calcularIdadeEmMeses(this.dataNascimento));
            data[ageInMonths - 1] = item.height;
        });
    } 

            
      }

      const media = medias[gender][currentAgeInMonths];
      const desvioPadrao = desviosPadrao[gender][currentAgeInMonths];
      const zScore = this.calcularZScore(altura, media, desvioPadrao);
      
      
      new Chart(ctx, {
          type: 'line',
          data: {
              labels: Array.from({ length: totalMonths }, (_, i) => i + 1),
              datasets: [
                {
                    label: 'Z-score -3',
                    data: this.zScores[gender].height['-3'],
                    borderColor: '#ff0020',
                    fill: false
                },
                  {
                      label: 'Z-score -2',
                      data: this.zScores[gender].height['-2'],
                      borderColor: '#ff0000',
                      fill: false
                  },
                  {
                      label: 'Z-score -1',
                      data: this.zScores[gender].height['-1'],
                      borderColor: '#ff8000',
                      fill: false
                  },
                  {
                      label: 'Z-score 0',
                      data: this.zScores[gender].height['0'],
                      borderColor: '#ffff00',
                      fill: false
                  },
                  {
                      label: 'Z-score 1',
                      data: this.zScores[gender].height['1'],
                      borderColor: '#80ff00',
                      fill: false
                  },
                  {
                      label: 'Z-score 2',
                      data: this.zScores[gender].height['2'],
                      borderColor: '#00ff00',
                      fill: false
                  },
                  {
                    label: 'Z-score 3',
                    data: this.zScores[gender].height['3'],
                    borderColor: '#00ff04',
                    fill: false
                },
                  {
                      label: type,
                      data: data,
                      borderColor: '#0000ff',
                      fill: false,
                      borderDash: [5, 5],
                      pointBackgroundColor: '#0000ff',
                      pointBorderColor: '#0000ff',
                      pointRadius: 5
                  }
              ]
          },
          options: {
              responsive: true,
              title: {
                  display: true,
                  text: type
              },
              scales: {
                  xAxes: [{
                      display: true,
                      scaleLabel: {
                          display: true,
                          labelString: v_periodo
                      }
                  }]
              }
          }
      });
      
    
}

calculateAgeInMonths(dateService: string): number {



    const serviceDate = new Date(dateService);
    const currentDate = new Date();
    const ageInMonths = (currentDate.getFullYear() - serviceDate.getFullYear()) * 12 + (currentDate.getMonth() - serviceDate.getMonth());
    return ageInMonths;
}


createHeightChartPlus(gender, currentAgeInMonths, altura,type) {
    const totalMonths = -60 +currentAgeInMonths + 4; // Ajustado para 24 meses

    var medias = null;
    var desviosPadrao = null;
    var ctx = null;

  if(type =='Peso'){ // calculo de peso

     medias = {
        male: [
            18.0, 18.5, 19.0, 19.5, 20.0, 20.5, 21.0, 21.5, 22.0, 22.5, 23.0, 23.5, 24.0, 24.5, 25.0, 25.5, 26.0, 26.5, 27.0, 27.5, 28.0, 28.5, 29.0, 29.5, 30.0, 30.5, 31.0, 31.5, 32.0, 32.5, 33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5, 37.0, 37.5, 38.0, 38.5, 39.0, 39.5, 40.0, 40.5, 41.0, 41.5, 42.0, 42.5, 43.0, 43.5, 44.0, 44.5, 45.0, 45.5, 46.0, 46.5, 47.0, 47.5, 48.0
        ],
        female: [
            17.5, 18.0, 18.5, 19.0, 19.5, 20.0, 20.5, 21.0, 21.5, 22.0, 22.5, 23.0, 23.5, 24.0, 24.5, 25.0, 25.5, 26.0, 26.5, 27.0, 27.5, 28.0, 28.5, 29.0, 29.5, 30.0, 30.5, 31.0, 31.5, 32.0, 32.5, 33.0, 33.5, 34.0, 34.5, 35.0, 35.5, 36.0, 36.5, 37.0, 37.5, 38.0, 38.5, 39.0, 39.5, 40.0, 40.5, 41.0, 41.5, 42.0, 42.5, 43.0, 43.5, 44.0, 44.5, 45.0, 45.5, 46.0, 46.5, 47.0, 47.5
        ]
    };

    desviosPadrao = {
        male: [
            2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.0, 8.1
        ],
        female: [
            2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.0
        ]
    };

    this.zScores = {
        male: {
            height: {
                '-2': [14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0, 32.0, 33.0, 34.0, 35.0, 36.0, 37.0, 38.0, 39.0, 40.0, 41.0, 42.0, 43.0, 44.0, 45.0, 46.0, 47.0, 48.0, 49.0, 50.0, 51.0, 52.0, 53.0, 54.0, 55.0, 56.0, 57.0, 58.0, 59.0, 60.0, 61.0, 62.0, 63.0, 64.0, 65.0, 66.0, 67.0, 68.0, 69.0, 70.0, 71.0, 72.0, 73.0, 74.0],
                '-1': [16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0, 32.0, 33.0, 34.0, 35.0, 36.0, 37.0, 38.0, 39.0, 40.0, 41.0, 42.0, 43.0, 44.0, 45.0, 46.0, 47.0, 48.0, 49.0, 50.0, 51.0, 52.0, 53.0, 54.0, 55.0, 56.0, 57.0, 58.0, 59.0, 60.0, 61.0, 62.0, 63.0, 64.0, 65.0, 66.0, 67.0, 68.0, 69.0, 70.0, 71.0, 72.0, 73.0, 74.0, 75.0, 76.0],
                '0': [18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0, 32.0, 33.0, 34.0, 35.0, 36.0, 37.0, 38.0, 39.0, 40.0, 41.0, 42.0, 43.0, 44.0, 45.0, 46.0, 47.0, 48.0, 49.0, 50.0, 51.0, 52.0, 53.0, 54.0, 55.0, 56.0, 57.0, 58.0, 59.0, 60.0, 61.0, 62.0, 63.0, 64.0, 65.0, 66.0, 67.0, 68.0, 69.0, 70.0, 71.0, 72.0, 73.0, 74.0, 75.0, 76.0, 77.0, 78.0],
                '1': [20.0, 21.0, 22.0, 23.0, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0, 32.0, 33.0, 34.0, 35.0, 36.0, 37.0, 38.0, 39.0, 40.0, 41.0, 42.0, 43.0, 44.0, 45.0, 46.0, 47.0, 48.0, 49.0, 50.0, 51.0, 52.0, 53.0, 54.0, 55.0, 56.0, 57.0, 58.0, 59.0, 60.0, 61.0, 62.0, 63.0, 64.0, 65.0, 66.0, 67.0, 68.0, 69.0, 70.0, 71.0, 72.0, 73.0, 74.0, 75.0, 76.0, 77.0, 78.0, 79.0, 80.0],
                '2': [22.0, 23.0, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0, 32.0, 33.0, 34.0, 35.0, 36.0, 37.0, 38.0, 39.0, 40.0, 41.0, 42.0, 43.0, 44.0, 45.0, 46.0, 47.0, 48.0, 49.0, 50.0, 51.0, 52.0, 53.0, 54.0, 55.0, 56.0, 57.0, 58.0, 59.0, 60.0, 61.0, 62.0, 63.0, 64.0, 65.0, 66.0, 67.0, 68.0, 69.0, 70.0, 71.0, 72.0, 73.0, 74.0, 75.0, 76.0, 77.0, 78.0, 79.0, 80.0, 81.0, 82.0]       
    },
            weight: [8, 9, 10] // Exemplo de z-scores de peso para meninos
        },
            female: {
              '-2': [13.5, 14.5, 15.5, 16.5, 17.5, 18.5, 19.5, 20.5, 21.5, 22.5, 23.5, 24.5, 25.5, 26.5, 27.5, 28.5, 29.5, 30.5, 31.5, 32.5, 33.5, 34.5, 35.5, 36.5, 37.5, 38.5, 39.5, 40.5, 41.5, 42.5, 43.5, 44.5, 45.5, 46.5, 47.5, 48.5, 49.5, 50.5, 51.5, 52.5, 53.5, 54.5, 55.5, 56.5, 57.5, 58.5, 59.5, 60.5, 61.5, 62.5, 63.5, 64.5, 65.5, 66.5, 67.5, 68.5, 69.5, 70.5, 71.5, 72.5, 73.5],
            '-1': [15.5, 16.5, 17.5, 18.5, 19.5, 20.5, 21.5, 22.5, 23.5, 24.5, 25.5, 26.5, 27.5, 28.5, 29.5, 30.5, 31.5, 32.5, 33.5, 34.5, 35.5, 36.5, 37.5, 38.5, 39.5, 40.5, 41.5, 42.5, 43.5, 44.5, 45.5, 46.5, 47.5, 48.5, 49.5, 50.5, 51.5, 52.5, 53.5, 54.5, 55.5, 56.5, 57.5, 58.5, 59.5, 60.5, 61.5, 62.5, 63.5, 64.5, 65.5, 66.5, 67.5, 68.5, 69.5, 70.5, 71.5, 72.5, 73.5, 74.5, 75.5],
            '0': [17.5, 18.5, 19.5, 20.5, 21.5, 22.5, 23.5, 24.5, 25.5, 26.5, 27.5, 28.5, 29.5, 30.5, 31.5, 32.5, 33.5, 34.5, 35.5, 36.5, 37.5, 38.5, 39.5, 40.5, 41.5, 42.5, 43.5, 44.5, 45.5, 46.5, 47.5, 48.5, 49.5, 50.5, 51.5, 52.5, 53.5, 54.5, 55.5, 56.5, 57.5, 58.5, 59.5, 60.5, 61.5, 62.5, 63.5, 64.5, 65.5, 66.5, 67.5, 68.5, 69.5, 70.5, 71.5, 72.5, 73.5, 74.5, 75.5, 76.5, 77.5],
            '1': [19.5, 20.5, 21.5, 22.5, 23.5, 24.5, 25.5, 26.5, 27.5, 28.5, 29.5, 30.5, 31.5, 32.5, 33.5, 34.5, 35.5, 36.5, 37.5, 38.5, 39.5, 40.5, 41.5, 42.5, 43.5, 44.5, 45.5, 46.5, 47.5, 48.5, 49.5, 50.5, 51.5, 52.5, 53.5, 54.5, 55.5, 56.5, 57.5, 58.5, 59.5, 60.5, 61.5, 62.5, 63.5, 64.5, 65.5, 66.5, 67.5, 68.5, 69.5, 70.5, 71.5, 72.5, 73.5, 74.5, 75.5, 76.5, 77.5, 78.5, 79.5],
            '2': [21.5, 22.5, 23.5, 24.5, 25.5, 26.5, 27.5, 28.5, 29.5, 30.5, 31.5, 32.5, 33.5, 34.5, 35.5, 36.5, 37.5, 38.5, 39.5, 40.5, 41.5, 42.5, 43.5, 44.5, 45.5, 46.5, 47.5, 48.5, 49.5, 50.5, 51.5, 52.5, 53.5, 54.5, 55.5, 56.5, 57.5, 58.5, 59.5, 60.5, 61.5, 62.5, 63.5, 64.5, 65.5, 66.5, 67.5, 68.5, 69.5, 70.5, 71.5, 72.5, 73.5, 74.5, 75.5, 76.5, 77.5, 78.5, 79.5, 80.5, 81.5]
                    },   weight: [7, 8, 9] // Exemplo de z-scores de peso para meninas
        
    };

    ctx = this.weightZChartCanvas.nativeElement.getContext('2d');

  }else{ // calculo de altura

        
        // Dados da OMS para meninos e meninas
        medias = {
            male: [
                110.0, 111.0, 112.0, 113.0, 114.0, 115.0, 116.0, 117.0, 118.0, 119.0, 120.0, 121.0, 122.0, 123.0, 124.0, 125.0, 126.0, 127.0, 128.0, 129.0, 130.0, 131.0, 132.0, 133.0, 134.0, 135.0, 136.0, 137.0, 138.0, 139.0, 140.0, 141.0, 142.0, 143.0, 144.0, 145.0, 146.0, 147.0, 148.0, 149.0, 150.0, 151.0, 152.0, 153.0, 154.0, 155.0, 156.0, 157.0, 158.0, 159.0, 160.0, 161.0, 162.0, 163.0, 164.0, 165.0, 166.0, 167.0, 168.0, 169.0, 170.0],
            female: [
                109.0, 110.0, 111.0, 112.0, 113.0, 114.0, 115.0, 116.0, 117.0, 118.0, 119.0, 120.0, 121.0, 122.0, 123.0, 124.0, 125.0, 126.0, 127.0, 128.0, 129.0, 130.0, 131.0, 132.0, 133.0, 134.0, 135.0, 136.0, 137.0, 138.0, 139.0, 140.0, 141.0, 142.0, 143.0, 144.0, 145.0, 146.0, 147.0, 148.0, 149.0, 150.0, 151.0, 152.0, 153.0, 154.0, 155.0, 156.0, 157.0, 158.0, 159.0, 160.0, 161.0, 162.0, 163.0, 164.0, 165.0, 166.0, 167.0, 168.0, 169.0]
        };

         desviosPadrao = {
            male: [
                5.0, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 10.0, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 11.0
            ],
            female: [
                4.9, 5.0, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 10.0, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 11.0
            ]
        };

    this.zScores = {
            male: {
            height: {
                '-2': [99.9, 102.1, 104.2, 106.1, 107.9, 109.6, 111.2, 112.7, 114.1, 115.5, 116.9, 118.2, 119.5, 120.7, 121.9, 123.1, 124.2, 125.3, 126.4, 127.4, 128.4, 129.4, 130.3, 131.2, 132.1, 133.0, 133.8, 134.6, 135.4, 136.2, 137.0, 137.7, 138.4, 139.1, 139.8, 140.5, 141.1, 141.8, 142.4, 143.0, 143.6, 144.2, 144.8, 145.4, 145.9, 146.5, 147.0, 147.5, 148.0, 148.5, 149.0, 149.5, 150.0, 150.4, 150.9, 151.3, 151.7, 152.2, 152.6, 153.0, 153.4],
                '-1': [103.3, 105.5, 107.6, 109.5, 111.3, 113.0, 114.6, 116.1, 117.6, 119.0, 120.3, 121.6, 122.9, 124.1, 125.3, 126.4, 127.5, 128.6, 129.6, 130.6, 131.6, 132.5, 133.4, 134.3, 135.2, 136.0, 136.8, 137.6, 138.4, 139.1, 139.8, 140.5, 141.2, 141.9, 142.5, 143.2, 143.8, 144.4, 145.0, 145.6, 146.2, 146.7, 147.3, 147.8, 148.3, 148.8, 149.3, 149.8, 150.3, 150.8, 151.2, 151.7, 152.1, 152.6, 153.0, 153.4, 153.8, 154.3, 154.7, 155.1, 155.5],
                '0': [106.7, 108.9, 111.0, 112.9, 114.8, 116.5, 118.1, 119.7, 121.2, 122.6, 124.0, 125.4, 126.7, 128.0, 129.2, 130.4, 131.5, 132.6, 133.7, 134.7, 135.7, 136.7, 137.6, 138.5, 139.4, 140.2, 141.0, 141.8, 142.6, 143.3, 144.0, 144.7, 145.4, 146.0, 146.7, 147.3, 147.9, 148.5, 149.1, 149.7, 150.2, 150.8, 151.3, 151.8, 152.3, 152.8, 153.3, 153.8, 154.3, 154.8, 155.2, 155.7, 156.1, 156.6, 157.0, 157.4, 157.8, 158.3, 158.7, 159.1, 159.5],
                '1': [110.1, 112.3, 114.4, 116.3, 118.2, 119.9, 121.5, 123.1, 124.6, 126.0, 127.4, 128.7, 130.0, 131.2, 132.4, 133.5, 134.6, 135.7, 136.7, 137.7, 138.7, 139.6, 140.5, 141.4, 142.2, 143.0, 143.8, 144.6, 145.3, 146.0, 146.7, 147.4, 148.0, 148.7, 149.3, 149.9, 150.5, 151.1, 151.7, 152.2, 152.8, 153.3, 153.8, 154.3, 154.8, 155.3, 155.8, 156.3, 156.8, 157.2, 157.7, 158.1, 158.6, 159.0, 159.4, 159.8, 160.3, 160.7, 161.1, 161.5, 161.9],
                '2': [113.5, 115.7, 117.8, 119.7, 121.6, 123.3, 124.9, 126.5, 128.0, 129.4, 130.8, 132.1, 133.4, 134.6, 135.8, 136.9, 138.0, 139.1, 140.1, 141.1, 142.1, 143.0, 143.9, 144.8, 145.6, 146.4, 147.2, 148.0, 148.7, 149.4, 150.1, 150.8, 151.4, 152.0, 152.6, 153.2, 153.8, 154.4, 154.9, 155.4, 156.0, 156.5, 157.0, 157.5, 158.0, 158.5, 159.0, 159.4, 159.9, 160.4, 160.8, 161.3, 161.7, 162.2, 162.6, 163.0, 163.4, 163.9, 164.3, 164.7, 165.1],
            weight: [8, 9, 10] // Exemplo de z-scores de peso para meninos
        },
            female: {
            height: {
            '-2': [99.1, 101.3, 103.4, 105.3, 107.1, 108.8, 110.4, 111.9, 113.3, 114.7, 116.0, 117.3, 118.5, 119.7, 120.8, 121.9, 123.0, 124.0, 125.0, 126.0, 126.9, 127.8, 128.7, 129.5, 130.3, 131.1, 131.9, 132.6, 133.3, 134.0, 134.7, 135.3, 136.0, 136.6, 137.2, 137.8, 138.4, 138.9, 139.5, 140.0, 140.5, 141.0, 141.5, 142.0, 142.5, 143.0, 143.4, 143.9, 144.3, 144.7, 145.2, 145.6, 146.0, 146.4, 146.8, 147.2, 147.6, 148.0, 148.4, 148.8, 149.2],
            '-1': [102.5, 104.7, 106.8, 108.7, 110.5, 112.2, 113.8, 115.3, 116.7, 118.1, 119.4, 120.7, 121.9, 123.1, 124.2, 125.3, 126.4, 127.4, 128.4, 129.4, 130.3, 131.2, 132.1, 132.9, 133.7, 134.5, 135.2, 135.9, 136.6, 137.3, 137.9, 138.6, 139.2, 139.8, 140.4, 141.0, 141.6, 142.1, 142.7, 143.2, 143.7, 144.2, 144.7, 145.2, 145.7, 146.2, 146.6, 147.1, 147.5, 148.0, 148.4, 148.8, 149.2, 149.6, 150.0, 150.4, 150.8, 151.2, 151.6, 152.0, 152.4],
            '0': [105.9, 108.1, 110.2, 112.1, 113.9, 115.6, 117.2, 118.7, 120.1, 121.5, 122.8, 124.1, 125.3, 126.5, 127.6, 128.7, 129.8, 130.8, 131.8, 132.8, 133.7, 134.6, 135.5, 136.3, 137.1, 137.9, 138.6, 139.3, 140.0, 140.7, 141.3, 142.0, 142.6, 143.2, 143.8, 144.4, 144.9, 145.5, 146.0, 146.5, 147.0, 147.5, 148.0, 148.5, 149.0, 149.4, 149.9, 150.3, 150.8, 151.2, 151.6, 152.0, 152.4, 152.8, 153.2, 153.6, 154.0, 154.4, 154.8, 155.2, 155.6],
            '1': [109.3, 111.5, 113.6, 115.5, 117.3, 119.0, 120.6, 122.1, 123.5, 124.9, 126.2, 127.5, 128.7, 129.9, 131.0, 132.1, 133.2, 134.2, 135.2, 136.2, 137.1, 138.0, 138.9, 139.7, 140.5, 141.3, 142.0, 142.7, 143.4, 144.1, 144.7, 145.4, 146.0, 146.6, 147.2, 147.8, 148.3, 148.9, 149.4, 149.9, 150.4, 150.9, 151.4, 151.9, 152.4, 152.8, 153.3, 153.7, 154.2, 154.6, 155.0, 155.4, 155.8, 156.2, 156.6, 157.0, 157.4, 157.8, 158.2, 158.6, 159.0],
            '2': [112.7, 114.9, 117.0, 118.9, 120.7, 122.4, 124.0, 125.5, 126.9, 128.3, 129.6, 130.9, 132.1, 133.3, 134.4, 135.5, 136.6, 137.6, 138.6, 139.6, 140.5, 141.4, 142.3, 143.1, 143.9, 144.7, 145.4, 146.1, 146.8, 147.5, 148.1, 148.8, 149.4, 150.0, 150.6, 151.2, 151.7, 152.3, 152.8, 153.3, 153.8, 154.3, 154.8, 155.3, 155.8, 156.2, 156.7, 157.1, 157.6, 158.0, 158.4, 158.8, 159.2, 159.6, 160.0, 160.4, 160.8, 161.2, 161.6, 162.0, 162.4]
             ,
            weight: [8, 9, 10] // Exemplo de z-scores de peso para meninos
        }
    }
}

}
ctx = this.heightZChartCanvas.nativeElement.getContext('2d');

  }
   const media = medias[gender][-60+currentAgeInMonths];
   const desvioPadrao = desviosPadrao[gender][-60+currentAgeInMonths];

   const zScore = this.calcularZScore(altura, media,  desvioPadrao);

  const data = Array(totalMonths).fill(null).map((_, i) => (i === -60+currentAgeInMonths - 1 ? altura : null));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: totalMonths }, (_, i) => i + 1),
            datasets: [
                {
                    label: 'Z-score -2',
                    data: this.zScores[gender].height['-2'],
                    borderColor: '#ff0000',
                    fill: false
                },
                {
                    label: 'Z-score -1',
                    data: this.zScores[gender].height['-1'],
                    borderColor: '#ff8000',
                    fill: false
                },
                {
                    label: 'Z-score 0',
                    data: this.zScores[gender].height['0'],
                    borderColor: '#ffff00',
                    fill: false
                },
                {
                    label: 'Z-score 1',
                    data: this.zScores[gender].height['1'],
                    borderColor: '#80ff00',
                    fill: false
                },
                {
                    label: 'Z-score 2',
                    data: this.zScores[gender].height['2'],
                    borderColor: '#00ff00',
                    fill: false
                },
                {
                    label: type,
                    data: data,
                    borderColor: '#0000ff',
                    fill: false,
                    borderDash: [5, 5],
                    pointBackgroundColor: '#0000ff',
                    pointBorderColor: '#0000ff',
                    pointRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: type
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Idade (anos)'
                    }
                }]
            }
        }
    });

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
            faixaIMC: [null],
            urlAtestado: [null],
            nome: [null],
            atestado: [null],
            receita: [null],
            prescricaoMedica: [null],
            pedidoExame: [null],
            urlExame: [null],
            imc:[null],
            horarioSelected:[null],
            agendarRetorno: [null],
            emitirNotaFiscal:  [null],
            prescricao:  [null],
            pedido:  [null],
            
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
      //  params = params.append('doctorId', this.atendimento.doctorId);
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
                    NameResponse: data.userName,
                    isReturn:data.isReturn
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

    public GetTemplates() {
        this.fetchData(true);
    
        if (this.atendimento.doctorId !== null) { 
            this.service.GetTemplates(this.atendimento.doctorId, (response) => {
                this.isActive = false;
                if (response.length != 0) {
                    this.fetchData(false);
                }
            }, (error) => {
               // this.toastrService.danger(error);
                this.fetchData(false);

                                    // Inicializa as listas
                                    this.listPrescricao = [];
                                    this.listExames = [];
                    
                                    // Filtra os templates de acordo com o typeTemplate
                                    error.forEach(template => {
                                        if (template.typeTemplate.id === 1) {
                                            this.listPrescricao.push(template);
                                        } else if (template.typeTemplate.id === 2) {
                                            this.listExames.push(template);
                                        }
                                    });

            });
        } else {
            this.fetchData(false);
        }
    }
    

    public onTemplateChange(selectedIndex: string, type): void {
        const index = parseInt(selectedIndex, 10);
        
        if (!isNaN(index)) {
            const selectedTemplate = this.listPrescricao[index];
            const description = selectedTemplate.description;
    
            if(type =='prescricao'){
                            // Obtém o valor atual do campo de prescrição
            const prescricaoMedica = this.formConsultaPaciente.controls['prescricaoMedica'].value || '';
            
            // Adiciona o novo texto ao valor atual
            const novoTexto = this.decodeHexadecimalString(description ?? '') + "  " + prescricaoMedica ;
    
            // Atualiza o campo de prescrição com o novo texto
            this.formConsultaPaciente.controls['prescricaoMedica'].setValue(novoTexto);

            }else{
                            // Obtém o valor atual do campo de prescrição
            const pedidoExame = this.formConsultaPaciente.controls['pedidoExame'].value || '';
            
            // Adiciona o novo texto ao valor atual
            const novoTexto = this.decodeHexadecimalString(description ?? '') + "  " + pedidoExame ;
    
            // Atualiza o campo de prescrição com o novo texto
            this.formConsultaPaciente.controls['pedidoExame'].setValue(novoTexto);
            }

        }
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
        }else
        if(this.emitirNotaFiscalFlag==null){
            this.toastrService.warning('Por Favor Informe se deve ser Emitido a Nota Fiscal','Aditi Care!');
            this.isSaving = false;
            this.fetchData(false)
            return false;

        }        if(this.isretorno==null){
            this.toastrService.warning('Por Favor Informe se deve ser Agendado o Retorno','Aditi Care!');
            this.isSaving = false;
            this.fetchData(false)
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
            generateNfse: this.emitirNotaFiscalFlag,  
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
      //    console.error('Erro ao decodificar a sequência:', error);
          return encodedString; // Retorna uma string vazia em caso de erro
        }
      }

      getHistoricoChart(){

        let params = new HttpParams();
        params = params.append('doctorId', this.atendimento.doctorId);
        params = params.append('userId', this.atendimento.userId);

        if(this.atendimento.idChild!==null){
            params = params.append('childId', this.atendimento.idChild);
        }

        this.fetchData(true);
    
        this.service.HistoryChats(params, (response) => {
            this.isActive = false;
            if (response.length != 0) {
                this.fetchData(false);
        
                // Filtra a resposta para incluir apenas itens onde height não é null
                this.listChatHistory = response.filter(item => item.height !== null).map(item => {
                    // Verifica se a altura está em metros (0.xx ou 1.xx) e converte para centímetros
                    if ((item.height >= 0 && item.height < 1) || (item.height >= 1 && item.height < 2)) {
                        item.height = Math.round(item.height * 100); // Converte metros para centímetros e arredonda para inteiro
                    }
                    return item;
                });
            }
        }, (error) => {
            // this.toastrService.danger(error);
            this.fetchData(false);
        });
        
        
        
        
        this.fetchData(false);
        
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

           var alturaEmCm = null;
           var pesoTratado = null;


            // Verifica se a altura está em metros (menor que 3 metros)
            if (response?.height < 3 && response?.height != null ) {
                alturaEmCm = Math.round(response?.height * 100)
            }else{
                alturaEmCm = Math.round(response?.height)
            }

            if (response?.weight >= 1000 && response?.weight != null) {
                // Converte o peso para quilogramas e formata com ponto decimal
                pesoTratado = (response.weight / 1000).toFixed(3);
            } else {
                pesoTratado = response?.weight;
            }

            // Defina o valor no controle do formulário
            this.formConsultaPaciente.controls['detalhesCliente'].setValue(this.decodeHexadecimalString(v_descriptionUser));
            this.formConsultaPaciente.controls['tempoRetorno'].setValue(response?.timeReturn ?? null);
            this.formConsultaPaciente.controls['altura'].setValue(alturaEmCm ?? null);
            this.formConsultaPaciente.controls['peso'].setValue(pesoTratado ?? null);
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
            this.toastrService.danger('Não Existe Historico para Este Paciente','Aditi Care');
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
          var pesoTratado = null;
          var alturaEmCm = null;

           if (response?.weight >= 1000 && response?.weight != null) {
            // Converte o peso para quilogramas e formata com ponto decimal
            pesoTratado = (response.weight / 1000).toFixed(3);
        } else {
            pesoTratado = response?.weight;
        }

            // Verifica se a altura está em metros (menor que 3 metros)
            if (response?.height < 3 && response?.height != null ) {
             alturaEmCm = Math.round(response?.height * 100)
          }else{
            alturaEmCm = Math.round(response?.height)
            }
        
           
            // Defina o valor no controle do formulário
            this.formConsultaPaciente.controls['detalhesCliente'].setValue(this.decodeHexadecimalString(v_descriptionUser));
            this.formConsultaPaciente.controls['detalhesInterno'].setValue(this.decodeHexadecimalString(v_descriptionClinic));
            this.formConsultaPaciente.controls['tempoRetorno'].setValue(response?.timeReturn ?? null);
            this.formConsultaPaciente.controls['altura'].setValue(alturaEmCm ?? null);
            this.formConsultaPaciente.controls['peso'].setValue(pesoTratado ?? null);
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

          calcularIMC(data: any) {
            if (data.controls.altura.value != null && data.controls.peso.value != null) {

                const alturaInput = data.controls.altura.value.toString();
                const pesoInput = data.controls.peso.value.toString();
                const idadeMeses = this.calcularIdadeEmMeses(this.dataNascimento);

                if (idadeMeses === null || isNaN(idadeMeses)) {
                    this.toastrService.warning(' Não foi possível calcular a idade ou o valor está nulo.', 'Aditi Care!');
                }
        
                // Substitua vírgulas por pontos
                const altura = parseFloat(alturaInput.replace(/,/g, '.'));
                const peso = parseFloat(pesoInput.replace(/,/g, '.'));
        
                // Verifique se a altura está em metros (menor que 10)
                const alturaEmMetros = altura < 10 ? altura : altura / 100;
        
                // Cálculo do IMC
                const V_imc = peso / (alturaEmMetros * alturaEmMetros);
        
                // Arredondamento
                const V_imc_arredondado = V_imc.toFixed(2);
        
                // Determinar a faixa de IMC de acordo com a OMS
                let faixaIMC = '';
                if (idadeMeses < 228) { // 19 anos em meses
                    // Cálculo para crianças e adolescentes
                    if (V_imc < 5) {
                        faixaIMC = 'Abaixo do peso';
                    } else if (V_imc >= 5 && V_imc < 85) {
                        faixaIMC = 'Peso normal';
                    } else if (V_imc >= 85 && V_imc < 95) {
                        faixaIMC = 'Sobrepeso';
                    } else {
                        faixaIMC = 'Obesidade';
                    }
                } else {
                    // Cálculo para adultos
                    if (V_imc < 18.5) {
                        faixaIMC = 'Magreza';
                    } else if (V_imc >= 18.5 && V_imc < 24.9) {
                        faixaIMC = 'Normal';
                    } else if (V_imc >= 25 && V_imc < 29.9) {
                        faixaIMC = 'Sobrepeso';
                    } else if (V_imc >= 30 && V_imc < 34.9) {
                        faixaIMC = 'Obesidade grau I';
                    } else if (V_imc >= 35 && V_imc < 39.9) {
                        faixaIMC = 'Obesidade grau II';
                    } else {
                        faixaIMC = 'Obesidade grau III';
                    }
                }
        
                // Exibindo o resultado
                this.formConsultaPaciente.controls['imc'].setValue(V_imc_arredondado ?? null);
                this.formConsultaPaciente.controls['faixaIMC'].setValue(faixaIMC ?? null);
            } else {
                this.toastrService.warning('Por Favor Preencha Altura, Peso e Idade Para o Calculo', 'Aditi Care!');
            }
        }
        

        
        calcularIdade(dataNascimento: string) {

            const hoje = new Date();
            const nascimento = new Date(dataNascimento);
        
            let anos = hoje.getFullYear() - nascimento.getFullYear();
            let meses = hoje.getMonth() - nascimento.getMonth();
            let dias = hoje.getDate() - nascimento.getDate();
        
            // Ajustar os meses e anos se necessário
            if (meses < 0 || (meses === 0 && dias < 0)) {
                anos--;
                meses += 12;
            }
        
            // Ajustar os dias se necessário
            if (dias < 0) {
                const ultimoDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate();
                dias += ultimoDiaMesAnterior;
                meses--;
            }
        
            const dataCompleta = `Nasceu em ${nascimento.getFullYear()}, e Tem ${anos} anos ${meses} Meses e ${dias} Dias de Vida.`;
        
            return dataCompleta;
        }
        

}
