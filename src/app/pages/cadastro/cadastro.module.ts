import { NgModule } from '@angular/core';
import { NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbCheckboxModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastroComponent } from './cadastro.component';
import { CadastroRoutingModule } from './cadastro-routing.module';
import { CadastroClinicaComponent } from './cadastro-clinica/cadastro-clinica.component';
import { CadastroMedicoComponent } from './cadastro-medico/cadastro-medico.component';
import { NgxMaskModule } from 'ngx-mask';
import { ToastrComponent } from '../shared/component/toastr/toastr.component';

@NgModule({
  imports: [
    CommonModule,
    CadastroRoutingModule,
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
    NbCheckboxModule, 
    NgxMaskModule.forRoot(),    
  ],
  exports: [
  ],
  declarations: [
    ToastrComponent,
    CadastroComponent,    
    CadastroMedicoComponent,
    CadastroClinicaComponent      
  ],
})
export class CadastroModule { }
