import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VisualizarAgendaComponent } from './visualizar-agenda.component';
import { AgendaComponent } from './agenda/agenda.component';

const routes: Routes = [{
  path: '',
  component: VisualizarAgendaComponent,
  children: [
    {
      path: 'agenda',
      component: AgendaComponent,
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
export class VisualizarAgendaRoutingModule { }

export const routedComponents = [
 VisualizarAgendaComponent, 
 AgendaComponent
];
