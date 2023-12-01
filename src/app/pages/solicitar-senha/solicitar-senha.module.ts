import { NgModule } from '@angular/core';
import { NbActionsModule, NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule, NbListModule, NbRadioModule, NbSelectModule, NbTabsetModule, NbUserModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxMaskModule } from 'ngx-mask';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SolicitarSenhaRoutingModule } from './solicitar-senha-routing.module';
import { SolicitarSenhaComponent } from './solicitar-senha.component';
import { ValidaTokenComponent } from './valida-token/valida-token.component';
import { AlterarSenhaComponent } from './alterar-senha/alterar-senha.component';
import { EnviarSenhaEmailComponent } from './enviar-senha-email/enviar-senha-email.component';

@NgModule({
  imports: [
    CommonModule,
    SolicitarSenhaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NgxEchartsModule,
    NgxMaskModule.forRoot(),
    Ng2SmartTableModule,
    NgxDatatableModule,
    NbCheckboxModule,
    NbAlertModule
  ],
  declarations: [
    SolicitarSenhaComponent,
    ValidaTokenComponent,
    AlterarSenhaComponent,
    EnviarSenhaEmailComponent
  ],
  entryComponents: [
    ValidaTokenComponent
  ],
})
export class SolicitarSenhaModule {
}
