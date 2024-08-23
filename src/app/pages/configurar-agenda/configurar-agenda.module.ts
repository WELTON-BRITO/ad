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
  NbToggleModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ConfigurarAgendaRoutingModule } from './configurar-agenda-routing.module';
import { ConfigurarAgendaComponent } from './configurar-agenda.component';
import { VisualizarDiaAtendimentoComponent } from './visualizar-dia-atendimento/visualizar-dia-atendimento.component';
import { ConfigurarDiaAtendimentoComponent } from './configurar-dia-atendimento/configurar-dia-atendimento.component';
import { ConfigurarExcecaoAtendimentoComponent } from './configurar-excecao-atendimento/configurar-excecao-atendimento.component';
import { GerarQrCodeComponent } from './gerar-qr-code/gerar-qr-code.component';
import { ParametrizarPlanoComponent } from './parametrizar-plano/parametrizar-plano.component';
import { ParametrizarConsultaComponent } from './parametrizar-consulta/parametrizar-consulta.component';
import { VisualizarDiaAtendimentoService } from './visualizar-dia-atendimento/visualizar-dia-atendimento.service';
import { EncriptyUtilService } from '../shared/services/encripty-util.services';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CadastrarTemplatesComponent } from '../configurar-agenda/cadastrar-templates/cadastrar-templates';
import { ConfigurarTemplatesComponent } from '../configurar-agenda/configurar-templates/configurar-templates';


@NgModule({
  imports: [
    CommonModule,
    ConfigurarAgendaRoutingModule,
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
    NbToggleModule  
  ],
  declarations: [
    ConfigurarAgendaComponent,
    VisualizarDiaAtendimentoComponent,
    ConfigurarDiaAtendimentoComponent,
    ConfigurarExcecaoAtendimentoComponent,
    GerarQrCodeComponent,
    ParametrizarPlanoComponent,
    ParametrizarConsultaComponent,
    CadastrarTemplatesComponent,
    ConfigurarTemplatesComponent
  ],
  providers: [
    VisualizarDiaAtendimentoComponent,
    VisualizarDiaAtendimentoService,
    EncriptyUtilService,
  ]
})
export class ConfigurarAgendaModule { }
