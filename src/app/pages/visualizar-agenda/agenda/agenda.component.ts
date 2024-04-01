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


  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    locale: 'pt-br',
    //height: 1000,
    themeSystem: 'bootstrap',
    slotMinTime: '06:00',
    slotMaxTime: '23:00',
    timeZone: 'local', // Fuso horário local
    slotLabelFormat: { hour: 'numeric', minute: '2-digit', omitZeroMinute: false },
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      start: 'prev,next today',
      center: 'title',
       right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
      list: 'Lista',
    },

    
    windowResize: function(view) {
      if (window.innerWidth < 768) { // Supondo que 768px seja o breakpoint para dispositivos móveis
        this.changeView('timeGridDay'); // Muda para a visualização do dia
        this.calendar.changeView('timeGridDay');
        this.changeDetector.detectChanges();
      } else {
        this.changeView('timeGridWeek'); // Muda para a visualização do mês
      }
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
          var dataMenosSeteDias = new Date(dataInicio.getTime() - (7 * 24 * 60 * 60 * 1000));
          // Extrair os componentes da nova data
          var ano = dataMenosSeteDias.getFullYear();
          var mes = (dataMenosSeteDias.getMonth() + 1).toString().padStart(2, '0'); // Adiciona um zero à esquerda, se necessário
          var dia = dataMenosSeteDias.getDate().toString().padStart(2, '0'); // Adiciona um zero à esquerda, se necessário
          // Formatando a nova data
          var dateInicio = ano + '/' + mes + '/' + dia;

          // Subtrair 7 dias da data original
          var dataMais30Dias = new Date(dataFim.getTime() + (30 * 24 * 60 * 60 * 1000));
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

          this.buscarAtendimento(register, true)
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

        this.buscarAtendimento(register, true)
        this.TodayDate = dateInicio.replace(/\//g, '-');
        this.FinalDate = dateFim.replace(/\//g, '-');
      }

    },
    //initialView: 'timeGridWeek',
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

    this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));

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
    outraData.setDate(time.getDate() + 7);
    this.FinalDate = moment(outraData).format('YYYY-MM-DD')

    var outraData2 = new Date();
    outraData2.setDate(time.getDate() - 7);
    this.StartedDate = moment(outraData2).format('YYYY-MM-DD')


    this.formAgendaAtendimento = this.formBuilder.group({
      dataInicio: [this.StartedDate, Validators.required],
      dataFim: [this.FinalDate, Validators.required],
      medico: [this.listMedico[0], Validators.required],

    });

    this.formAgendaAtendimento.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });
    this.listMedico.push({
      id: '9999999',
      name: 'Todos'
    })

    let register = {
      dataInicio: this.StartedDate,
      dataFim: this.FinalDate,
      medico: this.listMedico[0].id,
    }

    if (localStorage.getItem('googleData') === null || localStorage.getItem('googleData') === '') {
      this.buscarAtendimento(register, true)
    } else {
      this.buscarAtendimento(register, false)

    }
  }

  async fetchData(data) {
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
      medicoId: selected,
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
    let clinica = localStorage.getItem('bway-entityId');

    if (localStorage.getItem('googleData') === null || checked == true || localStorage.getItem('googleData') === '') {
      localStorage.removeItem('googleData');

      params = params.append('startDate', data.dataInicio)
      params = params.append('endDate', data.dataFim)
      params = params.append('statusIds', this.DefaultStatus);
      params = params.append('clinicId', clinica)

      this.isActive = true

      if (this.validaCampo(data)) {

        if (data.medico != '9999999') {
          params = params.append('doctorId', data.medico)
        }
        let allData = []; // Crie uma variável vazia para armazenar os dados
       
         this.service.buscaAtendimentos(params, (response) => {

          this.isActive = false
          this.rowData = response
          this.calendarEvents =  this.rowData.map(evento => {
            let color;
            switch (evento.status) {
              case '01 - Aguardando Aprovação':
                color = 'coral'; // Vermelho claro
                break;
              case '02 - Aguardando Pagamento':
                color = 'red'; // Amarelo claro
                break;
              case '03 - Consulta Confirmada':
                color = 'green'; // Verde claro
                break;
              case '04 - Consulta Finalizada':
                color = 'blue'; // Azul claro
                break;
              default:
                color = 'green'; // Cor padrão (caso o status não corresponda a nenhum dos valores acima)
            }
            if (!evento.isConfirmed && evento.name !=='Bloqueado') {
              color = 'orange';
            }

            return {
              title: evento.child?.name ?? evento.user.name,
              start: evento.dateService.concat('T', evento.startTime),
              end: evento.dateService.concat('T', evento.endTime),
              id: evento.id,
              responsavel: evento.user.name,
              medico: evento.doctor.name,
              paciente: evento.child?.name ?? evento.user.name,
              data: evento.dateService,
              nameFather: evento.child?.nameFather ?? null,
              nameMother: evento.child?.nameMother ?? null,
              typePayment: evento.typePayment,
              typeService: evento.typeService,
              status: evento.status,
              horario: evento.startTime.concat(' - ', evento.endTime),
              dados: evento,
              isConfirmed: evento.isConfirmed ? 'Horário Confirmado' : 'Horário Não Confirmado', 
              patchPaciente: 'googleCalendar',
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
            this.saveData('googleData', allData);
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

      }

    } else {
      const allData = localStorage.getItem('googleData')
      if (allData) {
        // Converta os dados de string para objeto
        const parsedData = JSON.parse(allData);

        // Preencha os cards com os dados recuperados
        this.calendarEvents = parsedData;
      }
      this.fetchData(false)

    }


  }

  validaCampo(data) {

    if (data.medico == null) {
      this.toastrService.danger('O campo médico é obrigatório!!!');
      return false
    }
    if (data.dataInicio == null) {
      this.toastrService.danger('A data início do período é obrigatória!!!');
      return false
    }
    if (data.dataFim == null) {
      this.toastrService.danger('A data fim do período é obrigatória!!!');
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
  agendarAtendimento() {

    this.router.navigate(['/pages/atendimento/novo-atendimento']);

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
    this.router.navigateByUrl('/pages/atendimento/novo-atendimento', { state: data });
  }

  BloquearAtendimento() {
    this.router.navigate(['/pages/atendimento/bloquear-atendimento']);
  }

}
