import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/pages/dashboard',
    data:  ['USER','DOCTOR','CLINIC'],
    hidden: false,
  },
 /*{
    title: 'Painel',
    icon: 'flip-2-outline',
    link: '/pages/iot-dashboard',
    data: ['USER','DOCTOR','CLINIC'],
    hidden: false,
  },*/
  {
    title: 'Atendimento',
    icon: 'clock-outline',
    link: '/pages/atendimento',
    data: ['DOCTOR','CLINIC'],
    hidden: true,
    children: [
      {
        title: 'Agenda de Atendimento',
        link: '/pages/atendimento/buscar-atendimento',
      },
      {
        title: 'Calendário de Atendimento',
        link: '/pages/visualizar-agenda/agenda',
      },
      {
        title: 'Fila de Espera',
        link: '/pages/atendimento/fila-espera',
      }
    ]
  },
  /*{
    title: 'Visualizar Agenda',
    icon: 'monitor-outline',
    link: '/pages/visualizar-agenda',
    data: ['USER','DOCTOR','CLINIC'],
    hidden: false,
    children: [
      {
        title: 'Agenda',
        link: '/pages/visualizar-agenda/agenda',
      }
    ]
  },*/
  {
    title: 'Gestão de Pacientes',
    icon: 'people-outline',
    link: '/pages/gestao-paciente',
    data: ['USER','DOCTOR','CLINIC'],
    hidden: false,
    children: [
      {
        title: 'Consultar Pacientes',
        link: '/pages/gestao-paciente/paciente',
      },
    ]
  },
  {
    title: 'Configurar Atendimentos',
    icon: 'settings-outline',
    link: '/pages/configurar-agenda',
    data: ['USER','DOCTOR','CLINIC'],
    hidden: false,
    children: [
      /*{
        title: 'Configurar dia de Atendimento',
        link: '/pages/configurar-agenda/configurar-dia-atendimento',
      },*/ 
      {
        title: 'Horários de Atendimento',
        link: '/pages/configurar-agenda/visualizar-dia-atendimento',
      },    
      {
        title: 'Valores dos Atendimentos',
        link: '/pages/configurar-agenda/parametrizar-consulta',
      },
      {
        title: 'Planos de Saúde',
        link: '/pages/configurar-agenda/parametrizar-plano',
      },
      {
        title: 'Exceção de Dias/Horários',
        link: '/pages/configurar-agenda/configurar-excecao-atendimento',
      }, 
      {
        title: 'Cadastrar Templates',
        link: '/pages/configurar-agenda/cadastrar-templates',
      }, 
     /* {
        title: 'Configurar QR Code',
        link: '/pages/configurar-agenda/gerar-qr-code',
      }*/
    ]
  },
  {
    title: 'Configurar Clínica',
    icon: 'calendar-outline',
    link: '/pages/configurar-clinica',
    data: ['CLINIC'],
    hidden: true,
    children: [
      {
        title: 'Visualizar Médicos da Clínica',
        link: '/pages/configurar-clinica/list-medico',
      },
      {

       title: 'Associar Novos Médicos',
        link: '/pages/configurar-clinica/associar-medico',
      }
    ]
  },

]
