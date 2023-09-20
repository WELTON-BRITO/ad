import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurarAgendaComponent } from './configurar-agenda.component';
import { ConfigurarDiaAtendimentoComponent } from './configurar-dia-atendimento/configurar-dia-atendimento.component';
import { ConfigurarExcecaoAtendimentoComponent } from './configurar-excecao-atendimento/configurar-excecao-atendimento.component';
import { GerarQrCodeComponent } from './gerar-qr-code/gerar-qr-code.component';
import { ParametrizarPlanoComponent } from './parametrizar-plano/parametrizar-plano.component';
import { ParametrizarConsultaComponent } from './parametrizar-consulta/parametrizar-consulta.component';
import { VisualizarDiaAtendimentoComponent } from './visualizar-dia-atendimento/visualizar-dia-atendimento.component';

const routes: Routes = [{
  path: '',
  component: ConfigurarAgendaComponent,
  children: [
    {
      path: 'visualizar-dia-atendimento',
      component: VisualizarDiaAtendimentoComponent,
    },
    {
      path: 'configurar-dia-atendimento',
      component: ConfigurarDiaAtendimentoComponent,
    },
    {
      path: 'configurar-excecao-atendimento',
      component: ConfigurarExcecaoAtendimentoComponent,
    }, 
    {
      path: 'parametrizar-plano',
      component: ParametrizarPlanoComponent,
    },  
    {
      path: 'gerar-qr-code',
      component: GerarQrCodeComponent,
    }, 
    {
      path: 'parametrizar-consulta',
      component: ParametrizarConsultaComponent,
    }, 
  ],

}];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class ConfigurarAgendaRoutingModule { }

export const routedComponents = [
 ConfigurarAgendaComponent,
 ConfigurarDiaAtendimentoComponent,
 VisualizarDiaAtendimentoComponent,
 ConfigurarExcecaoAtendimentoComponent,
 GerarQrCodeComponent,
 ParametrizarPlanoComponent,
 ParametrizarConsultaComponent
];
