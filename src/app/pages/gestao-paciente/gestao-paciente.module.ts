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

import { GestaoPacienteComponent } from './gestao-paciente.component';
import { GestaoPacienteRoutingModule } from './gestao-paciente-routing.module';
import { NovoPacienteComponent } from './novo-paciente/novo-paciente.component';
import { PacienteComponent } from './paciente/paciente.component';
import { NgxMaskModule } from 'ngx-mask';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    GestaoPacienteRoutingModule,
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
    NgxMaskModule.forRoot(),
    Ng2SmartTableModule,
    NgxDatatableModule,

  ],
  declarations: [
    GestaoPacienteComponent, 
    PacienteComponent,
    NovoPacienteComponent
  ],
})
export class GestaoPacienteModule { }
