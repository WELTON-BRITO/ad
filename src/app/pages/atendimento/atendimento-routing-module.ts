import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BuscarAtendimentoComponent } from "./buscar-atendimento/buscar-atendimento.component";
import { AtendimentoComponent } from "./atendimento.component";
import { NovoAtendimentoComponent } from "./novo-atendimento/novo-atendimento.component";
import { ConsultaPacienteComponent } from "./consulta-paciente/consulta-paciente.component";
import { DetalheAtendimentoComponent } from "./detalhe-atendimento/detalhe-atendimento.component";
import { FilaEsperaComponent } from "./fila-espera/fila-espera.component";
import { AgendarConsultaComponent } from "./agendar-consulta/agendar-consulta.component";
import { bloquearAtendimentoComponent } from "./bloquear-atendimento/bloquear-atendimento.component";
import { reagendarAtendimentoComponent } from "./reagendar/reagendar-atendimento.component";
import { AnteciparAtendimentoComponent } from "./antecipar-atendimento/antecipar-atendimento.component";
import { notaFiscalComponent } from "./nota-fiscal-atendimento/nota-fiscal-atendimento";
import { TriagemComponent} from "./triagem/triagem";


const routes: Routes = [{
  path: '',
  component: AtendimentoComponent,
  children: [
    {
      path: 'buscar-atendimento',
      component: BuscarAtendimentoComponent,
    },
    {
      path: 'novo-atendimento',
      component: NovoAtendimentoComponent,
    },
    {
      path: 'consulta-paciente',
      component: ConsultaPacienteComponent,
    },
    {
      path: 'detalhe-atendimento',
      component: DetalheAtendimentoComponent,
    },
    {
      path: 'fila-espera',
      component: FilaEsperaComponent,
    },
    {
      path: 'agendar-consulta',
      component: AgendarConsultaComponent,
    },
    {
      path: 'bloquear-atendimento',
      component: bloquearAtendimentoComponent,
    }
    ,
    {
      path: 'reagendar-atendimento',
      component: reagendarAtendimentoComponent,
    },
    {
      path: 'antecipar-atendimento',
      component: AnteciparAtendimentoComponent,
    },
    {
      path: 'nota-fiscal-atendimento',
      component: notaFiscalComponent,
    },
    {
      path: 'triagem',
      component: TriagemComponent,
    }
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
export class AtendimentoRoutingModule { }

export const routedComponents = [
  BuscarAtendimentoComponent,
  NovoAtendimentoComponent,
  ConsultaPacienteComponent,
  DetalheAtendimentoComponent,
  FilaEsperaComponent,
  AgendarConsultaComponent,
  bloquearAtendimentoComponent,
  AnteciparAtendimentoComponent,
];
