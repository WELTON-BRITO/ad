import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { DateSelectArg, EventClickArg, EventApi, Calendar, EventInput, CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpParams } from '@angular/common/http';
import { VisualizarAgendaService } from '../visualizar-agenda';
import * as moment from 'moment';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalDetalheAtendimentoComponent } from './modal-detalhe-atendimento/modal-detalhe-atendimento.component';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'ngx-visualizar-agenda',
  styleUrls: ['./agenda.component.css'],
  templateUrl: './agenda.component.html'

})
export class AgendaComponent implements OnInit {

  @ViewChild('calendar') calendarComponent: any;

  calendarPlugins = [dayGridPlugin];
  calendarEvents: EventInput[] = [];

  public formAgendaAtendimento = null;
  public listMedico = null;
  public TodayDate = null;
  public FinalDate = null;
  public showMsgErro = false;
  public tipo = null;
  public isActive = false;
  public date1 = new Date();
  public currentYear = this.date1.getUTCFullYear();
  public currentMonth = this.date1.getUTCMonth() + 1;
  public currentDay = this.date1.getUTCDate();
  public currentDay2 = this.date1.getUTCDate() + 7;
  public FinalMonth: any;
  public FinalDay: any;
  public rowData = null;
  currentEvents: EventApi[] = [];
  calendarVisible = true;
  public DefaultStatus = '7,10,4,8';
  public StartedDate: any;
  public medicoId = null;
  public isLoader: boolean = false;
  public isSearch = false; 
  public horariosPorDia: string[][] = [];




  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    locale: 'pt-br',
    //height: 1000,
    themeSystem: 'bootstrap',
    slotMinTime: '06:00',
    slotMaxTime: '23:59',
    timeZone: 'local', // Fuso horário local
    slotLabelFormat: { hour: 'numeric', minute: '2-digit', omitZeroMinute: false },
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      start: 'prev,next, timeGridDay',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek',
    },
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
      list: 'Lista',
    },

    datesSet: (info) => {
      // Verificar se a visualização atual mudou para um mês diferente

      if (info.view.type === 'timeGridWeek') {

        // Obter o primeiro e último dia da semana atual
        const startDate = info.view.activeStart;
        const endDate = info.view.activeEnd;

        // Verificar se o primeiro dia e o último dia estão em meses diferentes
        const inicioMesAtual = startDate.getMonth();
        const fimMesAtual = endDate.getMonth();

        if (inicioMesAtual !== fimMesAtual) {

          var dataInicio = new Date(startDate);
          var dataFim = new Date(startDate);

          // Subtrair 7 dias da data original
          var dataMenosSeteDias = new Date(dataInicio.getTime() - (30 * 24 * 60 * 60 * 1000));
          // Extrair os componentes da nova data
          var ano = dataMenosSeteDias.getFullYear();
          var mes = (dataMenosSeteDias.getMonth() + 1).toString().padStart(2, '0'); // Adiciona um zero à esquerda, se necessário
          var dia = dataMenosSeteDias.getDate().toString().padStart(2, '0'); // Adiciona um zero à esquerda, se necessário
          // Formatando a nova data
          var dateInicio = ano + '/' + mes + '/' + dia;

          // Subtrair 7 dias da data original
          var dataMais30Dias = new Date(dataFim.getTime() + (90 * 24 * 60 * 60 * 1000));
          // Extrair os componentes da nova data
          var ano = dataMais30Dias.getFullYear();
          var mes = (dataMais30Dias.getMonth() + 1).toString().padStart(2, '0'); // Adiciona um zero à esquerda, se necessário
          var dia = dataMais30Dias.getDate().toString().padStart(2, '0'); // Adiciona um zero à esquerda, se necessário
          // Formatando a nova data
          var dateFim = ano + '/' + mes + '/' + dia;

          let register = {
            dataInicio: dateInicio,
            dataFim: dateFim,
            medico: this.medicoId !== null ? this.medicoId : this.listMedico[0].id,
          }

    //      if (localStorage.getItem('googleData') === null || localStorage.getItem('googleData') === '') {
           // this.buscarAtendimento(register, true)
   //       } else {
          //  this.buscarAtendimento(register, false)

   //       }
          this.TodayDate = dateInicio.replace(/\//g, '-');
          this.FinalDate = dateFim.replace(/\//g, '-');

        }
      } else if (info.view.type === 'dayGridMonth') {

        var dataInicioOriginal = info.startStr;
        var dataFimOriginal = info.endStr;
        // Extrair a parte da data (sem o fuso horário)
        var dateInicio = dataInicioOriginal.split('T')[0];
        var dateFim = dataFimOriginal.split('T')[0];

        let register = {
          dataInicio: dateInicio,
          dataFim: dateFim,
          medico: this.medicoId !== null ? this.medicoId : this.listMedico[0].id,
        }

        //if (localStorage.getItem('googleData') === null || localStorage.getItem('googleData') === '') {
        //  this.buscarAtendimento(register, true)
      //  } else {
       //   this.buscarAtendimento(register, false)

      //  }
        this.TodayDate = dateInicio.replace(/\//g, '-');
        this.FinalDate = dateFim.replace(/\//g, '-');
      }

    },
    initialEvents: INITIAL_EVENTS,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };

  constructor(private changeDetector: ChangeDetectorRef,
    private dialogService: NbDialogService,
    private service: VisualizarAgendaService,
    private toastrService: NbToastrService,
    private formBuilder: FormBuilder,
    private router: Router,) { }
 
  ngOnInit() {

    this.windowResize();

    localStorage.removeItem('meuCardData'); //garante que o cache foi apagado das telas posteriores

    localStorage.removeItem('detalhesData'); //garante que o cache foi apagado das telas posteriores


    window.addEventListener('orientationchange', function () {
      var orientation = screen.orientation.type;
      if (orientation === 'portrait-primary' || orientation === 'portrait-secondary') {
        document.body.classList.add('force-landscape');
      } else {
        document.body.classList.remove('force-landscape');
      }
    });

    this.listMedico = JSON.parse(localStorage.getItem('bway-medico'));

    if (this.listMedico && this.listMedico.length > 0) {
    } else {
      console.error('A lista de médicos está vazia ou não definida!');
     this.toastrService.warning('Sua Sessão foi Encerrada, Efetue um Novo Login','Aditi Care');
    
    {
            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 3000); // 3000 milissegundos = 3 segundos
        }
    }

    if (this.currentMonth < 10) {
      this.FinalMonth = "0" + this.currentMonth;
    } else {
      this.FinalMonth = this.currentMonth;
    }

    if (this.currentDay < 10) {
      this.FinalDay = "0" + this.currentDay;
    } else {
      this.FinalDay = this.currentDay;
    }

    this.TodayDate = this.currentYear + "-" + this.FinalMonth + "-" + this.FinalDay;

    if (this.currentDay2 > 31) {
      this.FinalDay = 31;
    }

    this.FinalDate = this.currentYear + "-" + this.FinalMonth + "-" + this.FinalDay;

    var time = new Date();
    var outraData = new Date();
    outraData.setDate(time.getDate() + 180);
    this.FinalDate = moment(outraData).format('YYYY-MM-DD')

    var outraData2 = new Date();
    outraData2.setDate(time.getDate() - 30);
    this.StartedDate = moment(outraData2).format('YYYY-MM-DD')

    this.formAgendaAtendimento = this.formBuilder.group({
      dataInicio: [this.StartedDate, Validators.required],
      dataFim: [this.FinalDate, Validators.required],
      medico: [''],

    });

    let register = {
      dataInicio: this.StartedDate,
      dataFim: this.FinalDate,
      medico: this.listMedico[0].id,

    }


    if(this.isMobile() ||  localStorage.getItem('bway-domain') == 'DOCTOR'){

      this.formAgendaAtendimento.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });
      this.buscarAtendimento(register, true)
    }

   // 
 
   

    //if (localStorage.getItem('googleData') === null || localStorage.getItem('googleData') === '') {
    //  this.buscarAtendimento(register, true)
   // } else {
  //    this.buscarAtendimento(register, false)

   // }
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

  AnteciparAtendimento(data){

    if(data.medico ==null || data.medico ==""){
      this.toastrService.warning('Por Favor Informe o médico', 'Aditi Care');
    
    }else{
      data.patchPaciente = true;

      this.router.navigate(['/pages/atendimento/antecipar-atendimento'], { state: data });
      
    }


  }

  buscaId(data) {
    this.medicoId = data.medico
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {

    const dataInicio = new Date(selectInfo.start);
    const horaI = dataInicio.getHours();
    const minutosI = dataInicio.getMinutes();
    const horaInicio = `${horaI.toString().padStart(2, '0')}:${minutosI.toString().padStart(2, '0')}`;

    const dataFim = new Date(selectInfo.end);
    const horaF = dataFim.getHours();
    const minutosF = dataFim.getMinutes();
    const horaFim = `${horaF.toString().padStart(2, '0')}:${minutosF.toString().padStart(2, '0')}`;

    let countryId = this.formAgendaAtendimento.controls.medico.value;
    let selected = this.listMedico.find(medico => medico.id == countryId);

    const dataOriginal = dataInicio;
    const dataObj = new Date(dataOriginal);

    const dia = dataObj.getDate();
    const mes = dataObj.getMonth() + 1; // Os meses em JavaScript são baseados em zero (janeiro = 0)
    const ano = dataObj.getFullYear();

    // Formate a data no formato DD/MM/YYYY
    const dataFormatada = `${dia}/${mes}/${ano}`;
    

    let data = {
      data: dataFormatada,
      horario: horaInicio + ' -  ' + horaFim,
      medico:  this.medicoId,
      status: "Disponível",
      location: "agendaGoogle",
    }

    this.router.navigateByUrl('/pages/atendimento/novo-atendimento', { state: data });

  }

  handleEventClick(clickInfo: EventClickArg) {
    this.dialogService.open(ModalDetalheAtendimentoComponent, {
      closeOnBackdropClick: false,
      context: {
        dados: clickInfo.event,
      },
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  buscarAtendimento(data, checked) {

    this.fetchData(true)

    let params = new HttpParams();
// Obtém o item do local storage
    let clinicaData = localStorage.getItem('bway-clinica');

if (clinicaData) {
    // Parseia o JSON para um objeto

    let clinicaArray = JSON.parse(clinicaData);

    // Verifica se o array não está vazio e captura o id da primeira clínica
    if (clinicaArray.length > 0) {
        clinicaData = clinicaArray[0].id;
    } 
} 

    if (localStorage.getItem('googleData') === null || checked == true || localStorage.getItem('googleData') === '') {
      localStorage.removeItem('googleData');

      params = params.append('startDate', data.dataInicio)
      params = params.append('endDate', data.dataFim)
      params = params.append('statusIds', this.DefaultStatus);
      params = params.append('clinicId', clinicaData)

      this.isActive = true

      if (this.validaCampo(data)) {

        params = params.append('doctorId', data.medico)
        
        let allData = []; // Crie uma variável vazia para armazenar os dados

        this.service.buscaAtendimentos(params, (response) => {

          this.isActive = false
          this.rowData = response
          this.calendarEvents = this.rowData.map(evento => {
            let color: string; // Certifique-se de declarar 'color' como uma string

            switch (evento.status) {
              case '01 - Aguardando Aprovação':
                color = '#fd2205';
                break;
              case '02 - Aguardando Pagamento':
                color = '#fd2205';
                break;
              case '03 - Consulta Confirmada':
                color = '#727df5';
                break;
              case '04 - Consulta Finalizada':
                color = '#54dfb1'; 
                break;
              default:
                color = 'green'; // Cor padrão
            }
            
            if (!evento.isConfirmed && evento.userName !== 'Bloqueado' && evento.status !== '04 - Consulta Finalizada') {
              color = 'orange';
            }
            
            if (evento.userName == 'Bloqueado') {
              color = '#77747762';
            }
            
            this.isSearch=true;


            return {
              title: evento.childName ?? evento.userName,
              start: evento.dateService.concat('T', evento.startTime),
              end: evento.dateService.concat('T', evento.endTime),
              id: evento.id,
              responsavel: evento.userName,
              medico: evento.doctorName,
              paciente: evento.childName ?? evento.userName,
              data: evento.dateService,
              nameFather: evento.childFather ?? null,
              nameMother: evento.childMother ?? null,
              typePayment: evento.typePayment,
              typeService: evento.typeServiceName,
              status: evento.status,
              horario: evento.startTime.concat(' - ', evento.endTime),
              dados: evento,
              isConfirmed: evento.isConfirmed ? 'Horário Confirmado' : 'Horário Não Confirmado',
              patchPaciente: 'googleCalendar',
              telefone: this.formatPhoneNumber(evento.userPhone),
              color: color
            };
          });

          allData = this.calendarEvents;


          this.fetchData(false)

          if (allData.length === 0) {
            this.toastrService.warning("Não Foram Encontradas Atendimentos Para Este Médico.", 'Aditi Care');
            this.isActive = false;
            this.calendarEvents = [];
            this.rowData = [];
          } else {

            if(!this.isMobile() ||  localStorage.getItem('bway-domain') !== 'DOCTOR'){
                
              const compressedData = JSON.stringify(allData);
          //    localStorage.setItem('googleData', compressedData);
            }

            this.isActive = false;
            this.calendarEvents = allData;
            this.rowData = allData;
          }

        }, (error) => {
          this.isActive = false;
          if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
            this.fetchData(true)

          } else {
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`);
            this.fetchData(true)

          }
          this.toastrService.danger(error.error.message);

          this.fetchData(false)

        });

      }else{
        this.isSearch=false;
        this.fetchData(false)

      }

    } else {
      const allData = localStorage.getItem('googleData')
      if (allData) {
        // Converta os dados de string para objeto
        const parsedData = JSON.parse(allData);

        // Preencha os cards com os dados recuperados
        this.calendarEvents = parsedData;

        this.formAgendaAtendimento.controls['medico'].setValue(this.listMedico[this.findPositionById(this.listMedico,this.calendarEvents[0].dados.doctorId)].id, { onlySelf: true });

        this.medicoId = this.calendarEvents[0].dados.doctorId

      }
      this.fetchData(false)
    }   // this.verificaHorario()
  }

  formatPhoneNumber(phoneNumber: string): string {
    // Remove todos os caracteres não numéricos
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');

    // Verifica se o número tem 11 dígitos (com o nono dígito)
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);

    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    // Verifica se o número tem 10 dígitos (sem o nono dígito)
    const matchOldFormat = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);

    if (matchOldFormat) {
        return `(${matchOldFormat[1]}) ${matchOldFormat[2]}-${matchOldFormat[3]}`;
    }

    return phoneNumber; // Retorna o número original se não corresponder aos formatos esperados
}

  isMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
        
    // Verifica se o userAgent corresponde a dispositivos móveis
    if (/android/i.test(userAgent)) {
        return true;
    }
    if (/ipad|iphone|ipod/.test(userAgent)) {
        return true;
    }
    // Verifica se é um dispositivo macOS
    if (/macintosh|mac os x/.test(userAgent) && 'ontouchend' in document) {
        return true;
    }
    return false;
}


  findPositionById(listMedico: { id: number; name: string }[], targetId: number): number | null {

    var x;
    
    for (let i = 0; i < listMedico.length; i++) {
        if (listMedico[i].id == targetId) {
            x = i;     
        }
    }
    return x;
}
verificaHorario() {
  // this.isActive = true
  this.rowData = [];
  let params = new HttpParams();

  // Inicializar this.horariosPorDia como um array de arrays
  this.horariosPorDia = Array.from({ length: 7 }, () => []);

  params = params.append('doctorId', this.medicoId);

  this.fetchData(true);

  this.service.agendaDoctor(params, (response: any[]) => {
    if (response.length !== 0) {
      this.rowData = response;

      this.rowData.forEach(data => {
        const diaSemana = data.weekday;
        const horario = `${data.startTime} - ${data.endTime}`;

     
        if (horario.trim() !== '' && Array.isArray(this.horariosPorDia[diaSemana]) && !this.horariosPorDia[diaSemana].includes(horario)) {
          this.horariosPorDia[diaSemana].push(horario);
        }

      this.isActive = false;
      this.fetchData(false);
      });

      this.isActive = false;
      this.fetchData(false);

      // Gerar eventos de bloqueio
      this.generateAndAddEvents();
    } else {
      this.toastrService.danger('Este Médico Ainda não Possui Horários Cadastrados', 'Aditi Care');
      this.isActive = false;
      this.fetchData(false);
    }
  }, (error) => {
    this.isActive = false;
    this.toastrService.danger(error.error.message, 'Aditi Care');
    this.fetchData(false);
  });
}



 generateAndAddEvents() {
  const allHours = [
      '06:00 - 08:00',
      '08:00 - 12:00',
      '12:00 - 13:30',
      '13:30 - 18:30',
      '18:30 - 23:59'
  ];

  const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  daysOfWeek.forEach((day, index) => {
      const availableHours = this.horariosPorDia[index] || [];

      allHours.forEach(hour => {
          const [start, end] = hour.split(' - ');
          const isBlocked = !availableHours.some(availableHour => {
              const [availableStart, availableEnd] = availableHour.split(' - ');
              return (start >= availableStart && end <= availableEnd);
          });

          if (isBlocked) {
              this.calendarEvents.push({
                  title: 'Bloqueado',
                  start: `2024-08-29T${start}`,
                  end: `2024-08-29T${end}`,
                  color: '#77747762'
              });
          }
      });
  });

  // Adicionar eventos ao calendário
  this.rowData.forEach(evento => {
      let color;

      switch (evento.status) {
          case '01 - Aguardando Aprovação':
          case '02 - Aguardando Pagamento':
              color = '#fd2205';
              break;
          case '03 - Consulta Confirmada':
              color = '#727df5';
              break;
          case '04 - Consulta Finalizada':
              color = '#54dfb1';
              break;
          default:
              color = 'green';
      }

      if (!evento.isConfirmed && evento.userName !== 'Bloqueado' && evento.status !== '04 - Consulta Finalizada') {
          color = 'orange';
      }

      if (evento.userName == 'Bloqueado') {
          color = '#77747762';
      }

      this.isSearch = true;

      const start = evento.dateService ? evento.dateService.concat('T', evento.startTime || '') : '';
      const end = evento.dateService ? evento.dateService.concat('T', evento.endTime || '') : '';

      this.calendarEvents.push({
          title: evento.childName ?? evento.userName,
          start: start,
          end: end,
          id: evento.id,
          responsavel: evento.userName,
          medico: evento.doctorName,
          paciente: evento.childName ?? evento.userName,
          data: evento.dateService,
          nameFather: evento.childFather ?? null,
          nameMother: evento.childMother ?? null,
          typePayment: evento.typePayment,
          typeService: evento.typeServiceName,
          status: evento.status,
          horario: evento.startTime.concat(' - ', evento.endTime),
          dados: evento,
          isConfirmed: evento.isConfirmed ? 'Horário Confirmado' : 'Horário Não Confirmado',
          patchPaciente: 'googleCalendar',
          telefone: evento.userPhone,
          color: color
      });
  });
}

  validaCampo(data) {
    

    if (data.medico == null) {
      this.toastrService.danger('O campo médico é obrigatório','Aditi Care');
      return false
    }
    if (data.medico == "") {
      this.toastrService.danger('O campo médico é obrigatório','Aditi Care');
      return false
    }
    if (data.dataInicio == null) {
      this.toastrService.danger('A data início do período é obrigatória','Aditi Care');
      return false
    }
    if (data.dataFim == null) {
      this.toastrService.danger('A data fim do período é obrigatória','Aditi Care');
      return false
    }

    if (data.dataInicio > data.dataFim) {
      this.toastrService.danger('A data início não pode ser maior que a data fim!!!');
      return false
    }
    /*var diff = Math.abs(new Date(data.dataFim).getTime() - new Date(data.dataInicio).getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24))
    if (diffDays > 15) {
      this.toastrService.danger('O período de datas deve ser menor ou igual a 15 dias!!!');
      return false
    }*/
    return true
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
  agendarAtendimento(data) {

 
    if(data.medico ==null || data.medico ==""){
      data.patchPaciente = true;
      this.toastrService.warning('Por Favor Informe o médico', 'Aditi Care');
    
    }else{
      this.router.navigate(['/pages/atendimento/novo-atendimento'], { state: data });;
    
    }



  }

  desbloquear(data) {
    this.fetchData(true)

    this.isActive = true

    let register = {
      'id': data.id,
      'reasonCancellation': 'Botão Cancelar'
    }

    this.service.cancelarAtendimento(register, (response) => {
      this.isActive = false
      this.toastrService.success('Atendimento Cancelado com Sucesso', 'Aditi Care!');
      this.fetchData(false)

    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);
      this.fetchData(false)

    });
  }

  AgendaDefinida(data) {
    data.patchPaciente = true;
    this.router.navigateByUrl('/pages/atendimento/novo-atendimento', { state: data });
  }

  BloquearAtendimento(data) {
  
    if(data.medico ==null || data.medico ==""){
      this.toastrService.warning('Por Favor Informe o médico', 'Aditi Care');
    
    }else{
      data.patchPaciente = true;

      this.router.navigate(['/pages/atendimento/bloquear-atendimento'], { state: data })
    
    }

  }

  windowResize() {
    window.addEventListener('resize', () => this.windowResize());

    const isMobile = window.innerWidth <= 768; // Define a largura máxima para dispositivos móveis

    if (isMobile) {
      this.calendarOptions.initialView = 'timeGridDay';
      this.calendarOptions.headerToolbar = {
        start: '',
        center: 'prev,next,timeGridDay',
        end: '',
      };
    } else {
      this.calendarOptions.initialView = 'timeGridWeek';
      this.calendarOptions.headerToolbar = {
        start: 'prev,next, timeGridDay',
        center: 'title',
        end: 'dayGridMonth,timeGridWeek,listWeek',
      };
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => this.windowResize());
  }


}
