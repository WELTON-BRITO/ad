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
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CurrencyMaskModule } from 'ng2-currency-mask';
//import { NgxMaskModule } from 'ngx-mask';
import { ConfigurarClinicaRoutingModule } from './configurar-clinica-routing.module';
import { ConfigurarClinicaComponent } from './configurar-clinica.component';
import { AssociarMedicoComponent } from './associar-medico/associar-medico.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxMaskModule } from 'ngx-mask';
import { ListMedicoComponent } from './list-medico/list-medico.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigurarClinicaRoutingModule,
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
    Ng2SmartTableModule,  
    CurrencyMaskModule,
    NgxDatatableModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [
    ConfigurarClinicaComponent,
    AssociarMedicoComponent,
    ListMedicoComponent
  ],
  providers: [   
  ]
})
export class ConfigurarClinicaModule { }
