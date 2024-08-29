import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AgendaComponent } from './agenda.component';
import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { DateSelectArg, EventClickArg, EventApi, Calendar, EventInput, CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@NgModule({
  declarations: [
    AgendaComponent
  ],
  imports: [ 
    BrowserModule,
    FullCalendarModule
  ],
  providers: [],
  bootstrap: [AgendaComponent]
})
export class AgendaModule { 

  ngOnInit() {}
}






