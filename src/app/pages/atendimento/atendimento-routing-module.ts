import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BuscarAtendimentoComponent } from "./buscar-atendimento/buscar-atendimento.component";
import { AtendimentoComponent } from "./atendimento.component";
import { NovoAtendimentoComponent } from "./novo-atendimento/novo-atendimento.component";
import { ConsultaPacienteComponent } from "./consulta-paciente/consulta-paciente.component";

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
  ConsultaPacienteComponent
];
