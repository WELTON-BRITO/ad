import { Component, OnInit } from '@angular/core'; // Importe OnInit 
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { AtendimentoService } from "../atendimento.service";
import { NbToastrService } from "@nebular/theme";
import { HttpParams } from "@angular/common/http";
import * as moment from 'moment';
import { CPFValidator } from "../../shared/validators/CPFValidator";
import { LoaderService } from '../../shared/component/spinner/loarder/loader.service';


@Component({
  selector: 'ngx-buscar-atendimento',
  styleUrls: ['./buscar-atendimento.component.scss'],
  templateUrl: './buscar-atendimento.component.html',
})

export class BuscarAtendimentoComponent implements OnInit {
  public doctorId = null;
  public formBuscarAtendimento = null;
  public listMedico = null;
  public isActive = false;
  public rowData = null;
  public rowData2 = null;
  public msgErro = 'CPF inválido!!!';
  public showMsgErro = false;
  public tipo = null;
  public listClinica = null;
  public listTipoConsulta = [];
  public tipoConsulta = [];
  public DefaultStatus = '7,10,4,8';
  public checked = false;
  diaAnterior: string | null = null; // Inicialmente, não há dia anterior
  public tipoCard = [];
  public isBlock: boolean = true;
  TodayDate = "2022-02-15";
  FinalDate = "2022-02-15";
  date1 = new Date();
  currentYear = this.date1.getUTCFullYear();
  currentMonth = this.date1.getUTCMonth() + 1;
  currentDay = this.date1.getUTCDate();
  currentDay2 = this.date1.getUTCDate() + 7;
  FinalMonth: any;
  FinalDay: any;
  public isLoader: boolean = false;
  public avatar = "assets/images/avatar.png";


  settings = {
    //actions: false,
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: true,
    hideSubHeader: true,
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,

    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
  };

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: AtendimentoService,
    private toastrService: NbToastrService,
    private loader: LoaderService,
    ) {

    this.tipo = [

      {
        status: '9999',
        descricao: 'Todas'
      },
      {
        status: '7',
        descricao: '01 - Aguardando Aprovação'
      },
      {
        status: '10',
        descricao: '02 - Aguardando Pagamento'
      },
      {
        status: '4',
        descricao: '03 - Consulta Confirmada'
      },
      {
        status: '6',
        descricao: '04 - Consulta Cancelada'
      },
      {
        status: '8',
        descricao: '05 - Consulta Finalizada'
      },
    ];

  }

  get selectedCountry() {
    let countryId = this.formBuscarAtendimento.controls.medico.value;
    let selected = this.listMedico.find(medico => medico.id == countryId);
    return selected;
  }

  ngOnInit() {

    
    this.setupCollapse();
    this.listMedico = JSON.parse(localStorage.getItem('bway-medico'));

    if (this.listMedico && this.listMedico.length > 0) {
    } else {
      console.error('A lista de médicos está vazia ou não definida!');
     this.toastrService.warning('Sua Sessão foi Encerrada, Efetue um Novo Login','Aditi Care');
    
    {
            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 3000); // 3000 milissegundos = 3 segundos
        }
    }
    localStorage.removeItem('detalhesData'); //garante que o cache foi apagado das telas posteriores
    localStorage.removeItem('draftAtendimento');//garante que o cache foi apagado das telas posteriores

    if (this.currentMonth < 10) {
      this.FinalMonth = "0" + this.currentMonth;

    } else {
      this.FinalMonth = this.currentMonth;
    }

    if (this.currentDay < 10) {
      this.FinalDay = "0" + this.currentDay;

    } else {
      this.FinalDay = this.currentDay;
    }

    this.TodayDate = this.currentYear + "-" + this.FinalMonth + "-" + this.FinalDay;

    if (this.currentDay2 > 31) {
      this.FinalDay = 31;
    }

    this.FinalDate = this.currentYear + "-" + this.FinalMonth + "-" + this.FinalDay;

    var time = new Date();
    var outraData = new Date();
    outraData.setDate(time.getDate() + 15);
    this.FinalDate = moment(outraData).format('YYYY-MM-DD')

    this.listClinica = JSON.parse(localStorage.getItem('bway-clinica'));

    this.listTipoConsulta = [
      {
        id: 9999,
        descricao: "Todas"
      },
      {
        id: 1,
        descricao: "01 - Presencial"
      },
      {
        id: 3,
        descricao: "02 - Presencial Emergencial"
      },
      {
        id: 2,
        descricao: "03 - Por Video Chamada"
      },
      {
        id: 5,
        descricao: "04 - Video Chamada Emergencial"
      },
      {
        id: 4,
        descricao: "05 - Em Casa"
      },
      {
        id: 6,
        descricao: "06 - Procedimentos"
      }
    ];

    this.formBuscarAtendimento = this.formBuilder.group({
      dataInicio: [this.TodayDate, Validators.required],
      dataFim: [this.FinalDate, Validators.required],
      nome: [null],
      medico: [this.listMedico[0], Validators.required],
      clinica: [this.listClinica[0], Validators.required],
      cpf: [null],
      status: [this.tipo[0], Validators.required],
      tipoConsulta: [this.listTipoConsulta[0], Validators.required]
    });


    this.formBuscarAtendimento.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });
    this.formBuscarAtendimento.controls['clinica'].setValue(this.listClinica[0].id, { onlySelf: true }); // use the id of the first clinica
    this.formBuscarAtendimento.controls['tipoConsulta'].setValue(this.listTipoConsulta[0].id, { onlySelf: true }); // use the id of the first clinica
    this.formBuscarAtendimento.controls['status'].setValue(this.tipo[0].status, { onlySelf: true }); // use the id of the first clinica

    this.listMedico.push({
      id: '9999999',
      name: 'Todos'
    })

    var initData = [];
    this.rowData = initData;

    let register = {
      dataInicio: this.TodayDate,
      dataFim: this.FinalDate,
      medico: this.listMedico[0].id,
      clinicaId: this.listClinica[0].id,
      status: this.DefaultStatus,
      tipo: this.tipo[0].id ?? 1,
    }
    if (localStorage.getItem('meuCardData') === null || localStorage.getItem('meuCardData') === '') {

      this.buscarAtendimento(register, true)
    } else {
      this.buscarAtendimento(register, false)
    }

  }

  AnteciparAtendimento(){

    this.router.navigate(['/pages/atendimento/antecipar-atendimento']);

  }

  buscarAtendimento(data, checked) {

    this.fetchData(true)
    this.isActive = true;


    let clinica = localStorage.getItem('bway-entityId');

    if (localStorage.getItem('meuCardData') === null || checked == true || localStorage.getItem('meuCardData') === '') {
      this.saveData('meuCardData', '');
      localStorage.removeItem('detalhesData');
      localStorage.removeItem('draftAtendimento');

      this.isActive = true
      let params = new HttpParams();

      if (data.status != '9999') {
        params = params.append('statusIds', data.statusId ?? data.status ?? this.DefaultStatus);
      } else {
        params = params.append('statusIds', this.DefaultStatus);

      }
      params = params.append('startDate', data.dataInicio ?? '2024-01-01');
      params = params.append('endDate', data.dataFim ?? '2024-01-01');
      params = params.append('clinicId', data.clinicaId || data.clinica || 1);

      if (data.tipoConsulta != '9999' && data.tipoConsulta != null) {
        params = params.append('typeServiceId', data.tipoConsulta)
      }

      if (data.nome != null) {
        params = params.append('name', data.nome)
      }
      if (data.cpf != null) {
        params = params.append('federalId', data.cpf)
      }

      if (this.validaCampo(data)) {

        if (data.medico == '9999999') {

          params = params.append('clinicId', clinica)

          this.service.buscaAtendimentos(params, (response) => {
            this.isActive = false
            this.rowData = response
            this.rowData = this.rowData.map(data => {

              if (data.status != "05 - Consulta Cancelada") {
                return {
                  medico: data.doctor.name,
                  nome: data.child == null ? data.user.name : data.child.name,
                  data: moment(data.dateService).format('DD/MM/YYYY'),
                  horario: data.startTime.concat(' - ', data.endTime),
                  especialidade: data.specialty.name,
                  status: data.status,
                  atendimento: data,
                  modalidade: data.typeService,
                  dataInicio: this.formBuscarAtendimento.dataInicio,
                  dataFim: this.formBuscarAtendimento.dataInicio,
                  clinicaId: clinica,
                  statusId: this.DefaultStatus,
                  medicoId: data.doctor.id,
                  isConfirmed: data.isConfirmed ? 'Confirmado' : 'Não Confirmado',
                  avatar: this.getAvatar(data)
                }
                
              }
              this.fetchData(false)

            })

          }, (error) => {
            this.isActive = false;
            if (error.error instanceof ErrorEvent) {
              console.error('An error occurred:', error.error.message);
            } else {
              console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
            }
            this.toastrService.danger(error.message);
            this.fetchData(false)

          });

        } else {

          params = params.append('doctorId', data.medicoId ?? data.medico);
          let allData = []; // Crie uma variável vazia para armazenar os dados
          this.service.buscaAtendimentos(params, (response) => {
            allData = response
              .filter(data => data.status !== '05 - Consulta Cancelada')
              .map(data => ({
                id: data.id,
                medico: data.doctorName,
                nomeDependente: data?.childName,
                nomeResponsavel: data.userName,
                data: moment(data.dateService).format('DD/MM/YYYY'),
                horario: data.startTime.concat(' - ', data.endTime),
                especialidade: data.specialtyName,
                status: data.status,
                atendimento: data,
                modalidade: data.typeServiceName + ' - ' + (data?.procedureName ?? ''),
                email: data.userPhone,
                telefone: data.userEmail,
                dataInicio: data.dataInicio,
                dataFim: data.dataInicio,
                clinicaId: data.clinicId,
                statusId: this.DefaultStatus,
                medicoId: data.doctorId,
                isConfirmed: data.isConfirmed ? 'Confirmado' : 'Não Confirmado',
                avatar: this.getAvatar(data)
              }));

            if (allData.length === 0) {
              this.toastrService.warning("Não Foram Encontradas Atendimentos Para Este Médico.", 'Aditi Care');
              this.saveData('meuCardData', null);
              this.saveData('detalhesData', null);
              this.saveData('histDetails', null);
              this.isActive = false;
              this.rowData = null;
            } else {
              this.saveData('meuCardData', allData);
              this.isActive = false;
              this.rowData = allData;
            }
            this.fetchData(false)

          }, (error) => {
            this.isActive = false;
            this.toastrService.danger(error?.message || "Erro desconhecido.");
            this.fetchData(false)
          });

        }
      }

    } else {

      const allData = localStorage.getItem('meuCardData')

      if (allData) {
        // Converta os dados de string para objeto
        const parsedData = JSON.parse(allData);

        // Preencha os cards com os dados recuperados
        this.rowData = parsedData;
      }
      this.fetchData(false)

    }

    this.pesquisarConsulta(data, checked)
  }

  getAvatar(data) {
    if (data.childAvatar || data.userAvatar) {
      return `data:image/png;base64,${data.childAvatar ?? data.userAvatar}`;
    } else {
      // Retorna o caminho para a imagem padrão
      return this.avatar
    }
  }
  

  confirmarHorario(data){
   
    this.isActive = true

    this.fetchData(true)

 
    this.service.confirmarConsulta(data.id,'true', (response) => {
      this.isActive = false
      this.toastrService.success('Atendimento Confirmado com Sucesso', 'Aditi Care!');
      data.isConfirmed = 'Horário Confirmado';
      this.fetchData(false)

    }, (message) => {
      if(message.code ===200){
      this.toastrService.success('Atendimento Confirmado com Sucesso', 'Aditi Care!');
      data.isConfirmed = 'Horário Confirmado';
      this.fetchData(false)


    }
else{
  this.toastrService.danger('Ocorreu um Erro ao Confirmar o Horário, tente novamente mais tarde', 'Aditi Care!');
}
      this.isActive = false;
      this.fetchData(false)

    });
  }

  validaCampo(data) {

    if (data.medico == null) {
      this.toastrService.danger('O campo Médico é Obrigatório', 'Aditi Care');
      return false
    }
    if (data.dataInicio == null) {
      this.toastrService.danger('A data Início do Período é Obrigatória!!!', 'Aditi Care');
      return false
    }
    if (data.dataFim == null) {
      this.toastrService.danger('A data Fim do Período é Obrigatória', 'Aditi Care');
      return false
    }

    if (data.dataInicio > data.dataFim) {
      this.toastrService.danger('A data Inicial não Pode Ser Maior que a Data Fim', 'Aditi Care');
      return false
    }
    var diff = Math.abs(new Date(data.dataFim).getTime() - new Date(data.dataInicio).getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24))

    return true
  }

  isValidCpf(data) {

    if (!CPFValidator.isValidCPF(data.cpf)) {
      this.toastrService.warning('O Cpf Informado Não é Válido', 'Aditi Care');
      return false;
    }
    return true;
  }

  fetchData(data) {
    if(data){
    // Mostra o loader
    this.isLoader =true
    }else{
      setTimeout(() => {
        // Oculta o loader após o atraso
        this.isLoader =false
    }, 2000);
}
}

  agendarAtendimento() {

    this.router.navigate(['/pages/atendimento/novo-atendimento']);

  }

  desbloquear(data) {

    this.isActive = true

    let register = {
      'id': data.id,
      'reasonCancellation': 'Botão Cancelar'
    }

    this.fetchData(true)

    this.service.cancelarAtendimento(register, (response) => {
      this.isActive = false
      this.toastrService.success('Atendimento Cancelado com Sucesso', 'Aditi Care!');
      this.fetchData(false)

    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);
      this.fetchData(false)

    });
  }

  AgendaDefinida(data) {
    this.router.navigateByUrl('/pages/atendimento/novo-atendimento', { state: data });
  }

  BloquearAtendimento() {
    this.router.navigate(['/pages/atendimento/bloquear-atendimento']);
  }

  detalhes(data) {
    this.router.navigateByUrl('/pages/atendimento/detalhe-atendimento', { state: data.atendimento });
  }

  // Salva os dados no LocalStorage
  saveData(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Recupera os dados do LocalStorage
  getData(key: string): any {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  }

  iniciarAtendimento(data) {

    this.rowData = [{
      tela: 'atendimento',
      rowData: data.atendimento
    }]
 
    this.router.navigateByUrl('/pages/atendimento/consulta-paciente', { state: this.rowData });
  }

  videoAtendimento(url) {
    window.open(url.atendimento.meetingUrl, "_blank");
  }
  pesquisarConsulta(data, checked) {

    if (localStorage.getItem('CardTimesDisponivel') === null || checked == true || localStorage.getItem('CardTimesDisponivel') === '') {
      localStorage.removeItem('CardTimesDisponivel');

      let date = new Date(data.dataInicio)
      date.setDate(date.getDate() + 6)

      this.tipoCard = [];
      if (this.validaCampo(data)) {

        this.isActive = true
        let params = new HttpParams();
        params = params.append('doctorId', data.medico)
        params = params.append('startDate', data.dataInicio)
        params = params.append('endDate', data.dataFim ?? '2024-01-01');
        params = params.append('typeServiceId', data.tipo ?? 1)

        this.service.buscaHorario(params, (response) => {
          this.tipoCard = response.times.filter(item => item.status === 'Disponível')
            .map(data => ({
              data: moment(data.date).format('DD/MM/YYYY'),
              horario: `${data.startTime} - ${data.endTime}`,
              status: 'Disponível',
            }));

          if (this.tipoCard.length === 0) {
            // this.toastrService.warning("Não Existem Horários Livres Para Estes Dias", 'Aditi Care');
            this.isActive = false;
            this.rowData2 = null;
          } else {
            this.saveData('CardTimesDisponivel', this.tipoCard);
            this.isActive = false;
            this.rowData2 = this.tipoCard;
          }

        }, (error) => {
          this.isActive = false;
          this.toastrService.danger(error.error.message);
        });

      }
    } else {

      const allData = localStorage.getItem('CardTimesDisponivel')

      if (allData) {
        // Converta os dados de string para objeto
        const parsedData = JSON.parse(allData);

        // Preencha os cards com os dados recuperados
        this.rowData2 = parsedData;
      }
      this.fetchData(false)

    }

  }

  setupCollapse() {
    const isMobile = window.innerWidth <= 768; // Define a largura máxima para dispositivos móveis
    document.querySelectorAll('[data-toggle="collapse"]').forEach(element => {
      const target = document.querySelector(element.getAttribute('data-target'));
      // Se for mobile, inicia com os filtros fechados
      if (!isMobile && !target.classList.contains('show')) {
        target.classList.add('show');
      }
      // Adiciona o evento de clique
      element.addEventListener('click', () => {
        target.classList.toggle('show');
      });
    });
  }

  
}

