import { Component, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { NbDialogService } from '@nebular/theme';
import { ModalAgendaPacienteComponent } from './modal-agenda-paciente/modal-agenda-paciente.component';

declare var $: any;

@Component({
  selector: 'agenda-root', 
  styleUrls: ['./agenda.component.css'],
  templateUrl: './agenda.component.html'

})
export class AgendaComponent {

  calendarVisible = true;
  calendarOptions: CalendarOptions = {
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
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];

  constructor(private changeDetector: ChangeDetectorRef,
    private dialogService: NbDialogService) {
  }

  ngOnInit() {}

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {

    console.log('entrei aqui no click')
    console.log( selectInfo)
    console.log( selectInfo.view.calendar)

    //const title = prompt('Insira um novo título para o seu evento');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    //if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title: 'teste',
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
   // }
   
   this.dialogService.open(ModalAgendaPacienteComponent, {
    context: {
      razaoSocial: 'TESTE',
      cnpjCpf: 'TESTE',
      editar: "EDITAR"
    },
  });

    }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Tem certeza de que deseja excluir o evento '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }
}
