import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GestaoPacienteComponent } from './gestao-paciente.component';
import { NovoPacienteComponent } from './novo-paciente/novo-paciente.component';
import { PacienteComponent } from './paciente/paciente.component';

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
  NovoPacienteComponent
];
