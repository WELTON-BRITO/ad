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
        title: 'Buscar atendimentos',
        link: '/pages/atendimento/buscar-atendimento',
      },
      {
        title: 'Fila de espera',
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
        title: 'Listar Pacientes',
        link: '/pages/gestao-paciente/paciente',
      },
    ]
  },
  {
    title: 'Configurações do sistema',
    icon: 'calendar-outline',
    link: '/pages/configurar-agenda',
    data: ['USER','DOCTOR','CLINIC'],
    hidden: false,
    children: [
      /*{
        title: 'Configurar dia de Atendimento',
        link: '/pages/configurar-agenda/configurar-dia-atendimento',
      },*/     
      {
        title: 'Configurar Exceção',
        link: '/pages/configurar-agenda/configurar-excecao-atendimento',
      },
      {
        title: 'Configurar horários',
        link: '/pages/configurar-agenda/visualizar-dia-atendimento',
      },
      {
        title: 'Configurar Valores e Modalidades',
        link: '/pages/configurar-agenda/parametrizar-consulta',
      },
      {
        title: 'Configurar Plano',
        link: '/pages/configurar-agenda/parametrizar-plano',
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
        title: 'Listar Médicos',
        link: '/pages/configurar-clinica/list-medico',
      },
      {

       title: 'Associar Médicos',
        link: '/pages/configurar-clinica/associar-medico',
      }
    ]
  },

]
