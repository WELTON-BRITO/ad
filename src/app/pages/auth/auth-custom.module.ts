import { NgModule } from '@angular/core';
import { AuthCustomComponent } from './auth-custom.component';
import { NbCardModule, NbListModule, NbCheckboxModule, NbButtonModule, NbInputModule, NbAlertModule, NbLayoutModule } from '@nebular/theme';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { NbAuthModule } from '@nebular/auth';
import { CommonModule } from '@angular/common';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbAuthModule,
    NbCardModule,
    ThemeModule,
    NbLayoutModule,
    RouterModule
  ],
  declarations: [
    AuthCustomComponent
  ],
})
export class AuthCustomModule {
}
