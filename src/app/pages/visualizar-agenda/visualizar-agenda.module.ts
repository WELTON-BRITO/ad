import { NgModule } from '@angular/core';
import { NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { VisualizarAgendaRoutingModule } from './visualizar-agenda-routing.module';
import { EncriptyUtilService } from '../shared/services/encripty-util.services';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { VisualizarAgendaComponent } from './visualizar-agenda.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AgendaComponent } from './agenda/agenda.component';
import { BrowserModule } from '@angular/platform-browser';
import { ModalDetalheAtendimentoComponent } from './agenda/modal-detalhe-atendimento/modal-detalhe-atendimento.component';

@NgModule({
  imports: [
    CommonModule,
    VisualizarAgendaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NgxEchartsModule,
    Ng2SmartTableModule,  
    CurrencyMaskModule,
    NgxDatatableModule,
    //BrowserModule,
    FullCalendarModule  
  ],
  declarations: [
    VisualizarAgendaComponent,   
    AgendaComponent,
    ModalDetalheAtendimentoComponent,
  ], 
  providers: [    
    EncriptyUtilService,
  ],
  entryComponents: [
    ModalDetalheAtendimentoComponent
  ],
})
export class VisualizarAgendaModule { }
