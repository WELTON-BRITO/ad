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
  selector: 'agenda-root',
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
  calendarOptions: CalendarOptions = {
    locale: 'pt-br',
    allDayText: '24 horas',
    timeZone: 'local', // Fuso horário local
    slotLabelFormat: { hour: 'numeric', minute: '2-digit', omitZeroMinute: false },
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Hoje',
      list: 'Lista'
    },
    initialView: 'timeGridWeek',
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

    this.formAgendaAtendimento = this.formBuilder.group({
      dataInicio: [this.TodayDate, Validators.required],
      dataFim: [this.FinalDate, Validators.required],
      medico: [this.listMedico[0], Validators.required],
      
    });

    this.formAgendaAtendimento.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });
    this.listMedico.push({
      id: '9999999',
      name: 'Todos'
    })

    let register = {
      dataInicio: this.TodayDate,
      dataFim: this.FinalDate,
      medico: this.listMedico[0].id,
    }

    this.buscarAtendimento(register)
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

    let register = {
      inicio: horaInicio,
      fim: horaFim,
      medico: selected
    }

    this.router.navigateByUrl('/pages/atendimento/novo-atendimento', { state: register });

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

  buscarAtendimento(data) {

    let params = new HttpParams();

    params = params.append('startDate', data.dataInicio)
    params = params.append('endDate', data.dataFim)
    if ((data.status != null) && (data.status != "null")) {
      params = params.append('statusId', data.status)
    }
   
    this.isActive = true

    if (this.validaCampo(data)) {

      if (data.medico == '9999999') {

        let clinica = localStorage.getItem('bway-entityId');

        params = params.append('clinicId', clinica)

        this.service.buscaAtendimentos(params, (response) => {
          this.isActive = false
          this.rowData = response

        }, (error) => {
          this.isActive = false;
          if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
          } else {
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`);
          }
          this.toastrService.danger(error.error.message);

        });

      } else {

        params = params.append('doctorId', data.medico)

        this.service.buscaAtendimentos(params, (response) => {
          this.isActive = false
          this.rowData = response
          this.calendarEvents = this.rowData.map(evento => ({
            title: evento.child == null ? evento.user.name : evento.child.name,
            start: evento.dateService.concat('T', evento.startTime),
            end: evento.dateService.concat('T', evento.endTime),
            id: evento.id,
            medico: evento.doctor.name,
            paciente: evento.child == null ? evento.user.name : evento.child.name,
            data: evento.dateService,
            nameFather: evento.child == null ? evento.user.name : evento.child.nameFather,
            nameMother: evento.child == null ? evento.user.name : evento.child.nameMother,
            typePayment: evento.typePayment,
            typeService: evento.typeService,
            status: evento.status,
            horario: evento.startTime.concat(' - ', evento.endTime),
            dados: evento
            //color: 'green'
          }));

        }, (error) => {
          this.isActive = false;
          if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
          } else {
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`);
          }
          this.toastrService.danger(error.error.message);

        });

      }

    } else {
      this.isActive = false
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
    var diff = Math.abs(new Date(data.dataFim).getTime() - new Date(data.dataInicio).getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24))
    if (diffDays > 15) {
      this.toastrService.danger('O período de datas deve ser menor ou igual a 15 dias!!!');
      return false
    }
    return true
  }

}
