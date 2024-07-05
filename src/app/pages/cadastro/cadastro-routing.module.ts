import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CadastroComponent } from './cadastro.component';
import { CadastroClinicaComponent } from './cadastro-clinica/cadastro-clinica.component';
import { CadastroMedicoComponent } from './cadastro-medico/cadastro-medico.component';
import { CadastroWebComponent } from './cadastro-web/cadastro-web.component';


const routes: Routes = [{
  path: '',
  component: CadastroComponent,  

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
export class CadastroRoutingModule { }

export const routedComponents = [
  CadastroComponent,  
  CadastroMedicoComponent,
  CadastroClinicaComponent,
  CadastroWebComponent

];
