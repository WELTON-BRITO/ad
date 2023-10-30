import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbCardModule, NbUserModule, NbButtonModule, NbTabsetModule, NbActionsModule, NbRadioModule, NbSelectModule, NbListModule, NbIconModule, NbDatepickerModule, NbDialogService } from "@nebular/theme";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { NgxEchartsModule } from "ngx-echarts";
import { NgxMaskModule } from "ngx-mask";
import { ThemeModule } from "../../@theme/theme.module";
import { AtendimentoRoutingModule } from "./atendimento-routing-module";
import { AtendimentoComponent } from "./atendimento.component";
import { BuscarAtendimentoComponent } from "./buscar-atendimento/buscar-atendimento.component";
import { ToastrComponent } from "../shared/component/toastr/toastr.component";
import { NovoAtendimentoComponent } from "./novo-atendimento/novo-atendimento.component";
import { ConsultaPacienteComponent } from "./consulta-paciente/consulta-paciente.component";
import { DetalheAtendimentoComponent } from "./detalhe-atendimento/detalhe-atendimento.component";
import { MotivoCancelamentoComponent } from "./detalhe-atendimento/motivo-cancelamento/motivo-cancelamento.component";
import { AutosizeModule } from "@techiediaries/ngx-textarea-autosize";

@NgModule({
  imports: [
    CommonModule,
    AtendimentoRoutingModule,
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
    NbDatepickerModule.forRoot(),
    NbDatepickerModule,   
    AutosizeModule 
  ],
  declarations: [
    AtendimentoComponent,
    BuscarAtendimentoComponent,
    NovoAtendimentoComponent,
    ConsultaPacienteComponent,
    DetalheAtendimentoComponent,
    MotivoCancelamentoComponent,    
  ],  
})
export class AtendimentoModule { }
