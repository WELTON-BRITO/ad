import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { LoginComponent } from './pages/login/login.component';
import { AuthCustomComponent } from './pages/auth/auth-custom.component';
import { CadastroClinicaComponent } from './pages/cadastro/cadastro-clinica/cadastro-clinica.component';
import { CadastroWebComponent } from './pages/cadastro/cadastro-web/cadastro-web.component';
import { CadastroMedicoComponent } from './pages/cadastro/cadastro-medico/cadastro-medico.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { SolicitarSenhaComponent } from './pages/solicitar-senha/solicitar-senha.component';
import { AlterarSenhaComponent } from './pages/solicitar-senha/alterar-senha/alterar-senha.component';
import { EnviarSenhaEmailComponent } from './pages/solicitar-senha/enviar-senha-email/enviar-senha-email.component';

export const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'login',    
    component: AuthCustomComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      }
    ]
  },
  {
    path: 'cadastro',    
    component: AuthCustomComponent,
    children: [
      {
        path: '',
        component: CadastroComponent,
      },
      
    ]
  },
  {
    path: 'cadastro-medico',    
    component: AuthCustomComponent,
    children: [
      {
        path: '',
        component: CadastroMedicoComponent,
      }
    ]
  },
  {
    path: 'cadastro-clinica',    
    component: AuthCustomComponent,
    children: [
      {
        path: '',
        component: CadastroClinicaComponent,
      }
    ]
  },
  {
    path: 'cadastro-web',    
    component: AuthCustomComponent,
    children: [
      {
        path: '',
        component: CadastroWebComponent,
      }
    ]
  },
  {
    path: 'solicitar-senha',    
    component: AuthCustomComponent,
    children: [
      {
        path: '',
        component: SolicitarSenhaComponent,
      }
    ]
  }, 
  {
    path: 'enviar-senha-email',    
    component: AuthCustomComponent,
    children: [
      {
        path: '',
        component: EnviarSenhaEmailComponent,
      }
    ]
  }, 
  {
    path: 'alterar-senha',    
    component: AuthCustomComponent,
    children: [
      {
        path: '',
        component: AlterarSenhaComponent,
      }
    ]
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        component: NbLoginComponent,
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}