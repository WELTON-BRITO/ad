import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GestaoPacienteComponent } from './gestao-paciente.component';
import { NovoPacienteComponent } from './novo-paciente/novo-paciente.component';
import { PacienteComponent } from './paciente/paciente.component';
import { DependenteComponent } from './dependente/dependente.component';
import { PrecoEspecialComponent } from './preco-especial/preco-especial.component';
import { HistoricoComponent } from './historico/historico.component';
import { ImportarHistoricoComponent } from './historico/importar-historico/importar-historico.component';
import { EditarDependenteComponent } from '../gestao-paciente/editar-dependente/editar-dependente.component';
import { AgendaPacienteComponent } from '../gestao-paciente/visualizar-AgendaHistorico/visualizar-AgendaHistorico.component';


const routes: Routes = [{
  path: '',
  component: GestaoPacienteComponent,
  children: [
    {
      path: 'paciente',
      component: PacienteComponent,
    },  
    {
      path: 'novo-paciente',
      component: NovoPacienteComponent,
    },   
    {
      path: 'dependente',
      component: DependenteComponent,
    },   
    {
      path: 'preco-especial',
      component: PrecoEspecialComponent,
    }, 
    {
      path: 'historico',
      component: HistoricoComponent,
    },  
    {
      path: 'importar-historico',
      component: ImportarHistoricoComponent,
    },  
    {
      path: 'editar-dependente',
      component: EditarDependenteComponent,
    },  
    {
      path: 'visualizar-AgendaHistorico',
      component: AgendaPacienteComponent,
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
export class GestaoPacienteRoutingModule { }

export const routedComponents = [
  GestaoPacienteComponent,
  PacienteComponent,
  NovoPacienteComponent,
  DependenteComponent,
  PrecoEspecialComponent,
  HistoricoComponent,
  ImportarHistoricoComponent,
  EditarDependenteComponent,
  AgendaPacienteComponent,
];
