import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AgendaComponent } from './agenda.component';

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
export class AgendaModule { }
