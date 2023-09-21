import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Painel',
    icon: 'home-outline',
    link: '/pages/iot-dashboard',
    home: true,
  },
  {
    title: 'Agenda',
    icon: 'home-outline',
    link: '/pages/agenda',
  },
  {
    title: 'Visualizar Agenda',
    icon: 'calendar-outline',
    link: '/pages/configurar-agenda',
    children: [      
      {
        title: 'Consultar Agenda',
        link: '/pages/configurar-agenda/visualizar-dia-atendimento',
      },
      
    ]
  },
  {
    title: 'Gestão de Pacientes',
    icon: 'people-outline',
    link: '/pages/gestao-paciente',
    children: [      
      {
        title: 'Listar Pacientes',
        link: '/pages/gestao-paciente/paciente',
      }
    ]
  },
  {
    title: 'Configurar Agenda',
    icon: 'calendar-outline',
    link: '/pages/configurar-agenda',
    children: [      
      {
        title: 'Configurar dia de Atendimento',
        link: '/pages/configurar-agenda/configurar-dia-atendimento',
      },
      {
        title: 'Configurar Exceção',
        link: '/pages/configurar-agenda/configurar-excecao-atendimento',
      },
      {
        title: 'Configurar Atendimento',
        link: '/pages/configurar-agenda/parametrizar-consulta',
      },     
      {
        title: 'Configurar Plano',
        link: '/pages/configurar-agenda/parametrizar-plano',
      },
      {
        title: 'Configurar QR Code',
        link: '/pages/configurar-agenda/gerar-qr-code',
      }
    ]
  },
  {
    title: 'Configurar Clínica',
    icon: 'calendar-outline',
    link: '/pages/configurar-clinica',
    children: [      
      {
        title: 'Associar Médicos',
        link: '/pages/configurar-clinica/associar-medico',
      },
      {
        title: 'Listar Médicos',
        link: '/pages/configurar-clinica/list-medico',
      },
      
    ]
  }, 
  {
    title: '',
    group: true,
  },
  {
    title: 'Sair',
    icon: 'shopping-cart-outline',
    link: '/login',

  },
]