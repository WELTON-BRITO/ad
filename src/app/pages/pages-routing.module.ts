import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    {
      path: 'gestao-paciente',
      loadChildren: () => import('./gestao-paciente/gestao-paciente.module').then(m => m.GestaoPacienteModule)
    },
    {
      path: 'configurar-agenda',
      loadChildren: () => import('./configurar-agenda/configurar-agenda.module').then(m => m.ConfigurarAgendaModule)
    },
    {
      path: 'visualizar-agenda',
      loadChildren: () => import('./visualizar-agenda/visualizar-agenda.module').then(m => m.VisualizarAgendaModule)
    },
    {
      path: 'configurar-clinica',
      loadChildren: () => import('./configurar-clinica/configurar-clinica.module').then(m => m.ConfigurarClinicaModule)
    },
    {
      path: 'atendimento',
      loadChildren: () => import('./atendimento/atendimento.module').then(m => m.AtendimentoModule)
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
