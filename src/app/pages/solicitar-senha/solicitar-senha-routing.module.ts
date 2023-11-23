import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SolicitarSenhaComponent } from "./solicitar-senha.component";
import { AlterarSenhaComponent } from "./alterar-senha/alterar-senha.component";
import { EnviarSenhaEmailComponent } from "./enviar-senha-email/enviar-senha-email.component";

const routes: Routes = [{
  path: '',
  component: SolicitarSenhaComponent, 
  children: [
    {
      path: 'enviar-senha-email',
      component: EnviarSenhaEmailComponent,
    },
  ]
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
export class SolicitarSenhaRoutingModule { }

export const routedComponents = [
    SolicitarSenhaComponent,
    EnviarSenhaEmailComponent,
    AlterarSenhaComponent
];
