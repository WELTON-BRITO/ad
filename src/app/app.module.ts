import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { LoginModule } from './pages/login/login.module';
import { AuthenticationService } from './pages/shared/services/authenticationService.services';
import { HttpService } from './pages/shared/services/http/http-client.service';
import { LoadingBarService } from 'ng2-loading-bar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AuthCustomModule } from './pages/auth/auth-custom.module';
import { CadastroModule } from './pages/cadastro/cadastro.module';
import { CadastroRoutingModule } from './pages/cadastro/cadastro-routing.module';
import { GestaoPacienteModule } from './pages/gestao-paciente/gestao-paciente.module';
import { GestaoPacienteRoutingModule } from './pages/gestao-paciente/gestao-paciente-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { ConfigurarAgendaModule } from './pages/configurar-agenda/configurar-agenda.module';
import { TokenInterceptorService } from './pages/shared/filters/token-interceptor.service';
import { VisualizarAgendaModule } from './pages/visualizar-agenda/visualizar-agenda.module';
import { VisualizarAgendaRoutingModule } from './pages/visualizar-agenda/visualizar-agenda-routing.module';
import { ConfigurarAgendaRoutingModule } from './pages/configurar-agenda/configurar-agenda-routing.module';
import { ErrorHandlerService } from './pages/shared/services/http/error-handler.service';
import { AtendimentoModule } from './pages/atendimento/atendimento.module';
import { AtendimentoRoutingModule } from './pages/atendimento/atendimento-routing-module';
import { AutosizeModule } from '@techiediaries/ngx-textarea-autosize';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    NgxDatatableModule,
    AuthCustomModule,
    LoginModule,
    CadastroModule,
    CadastroRoutingModule,
    GestaoPacienteModule,
    GestaoPacienteRoutingModule,
    VisualizarAgendaModule,
    VisualizarAgendaRoutingModule,
    ConfigurarAgendaModule,
    ConfigurarAgendaRoutingModule,
    AtendimentoRoutingModule,
    AtendimentoModule,
    AutosizeModule
   ],
  providers:    [
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    LoadingBarService,
    AuthenticationService,
    HttpService,
 ],
 schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {
}
