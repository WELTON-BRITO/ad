import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurarClinicaComponent } from './configurar-clinica.component';
import { AssociarMedicoComponent } from './associar-medico/associar-medico.component';
import { ListMedicoComponent } from './list-medico/list-medico.component';

const routes: Routes = [{
  path: '',
  component: ConfigurarClinicaComponent,
  children: [
    {
      path: 'associar-medico',
      component: AssociarMedicoComponent,
    },
    {
      path: 'list-medico',
      component: ListMedicoComponent,
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
export class ConfigurarClinicaRoutingModule { }

export const routedComponents = [
  ConfigurarClinicaComponent,
  AssociarMedicoComponent,
  ListMedicoComponent
];
