import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { VisualizarDiaAtendimentoComponent } from '../visualizar-dia-atendimento/visualizar-dia-atendimento.component';
import { EncriptyUtilService } from '../../shared/services/encripty-util.services';
import { NbToastrService } from '@nebular/theme';
import { ConfigurarDiaAtendimentoService } from './configurar-dia-atendimento.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'ngx-configurar-dia-atendimento',
  styleUrls: ['./configurar-dia-atendimento.component.scss'],
  templateUrl: './configurar-dia-atendimento.component.html',
})
export class ConfigurarDiaAtendimentoComponent implements OnDestroy {

  public formDiaAtendimento = null;
  public doctorId = null;
  public rowData: any = [];
  public segunda = null;
  public terca = null;
  public quarta = null;
  public quinta = null;
  public sexta = null;
  public sabado = null;
  public domingo = null;
  public isActive = true;

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
    columns: {
      Segunda: {
        title: 'Segunda',
        //type: 'name',
      },
      Terça: {
        title: 'Terça',
        type: 'date',
      },
      Quarta: {
        title: 'Quarta',
        type: 'hora',
      },
      Quinta: {
        title: 'Quinta',
        //type: 'name',
      },
      Sexta: {
        title: 'Sexta',
        //type: 'name',
      },
      Sabado: {
        title: 'Sabado',
        //type: 'name',
      },
      Domingo: {
        title: 'Domingo',
        //type: 'name',
      },
    },
  };


  public listMedico = null;
  public listSemana = null;
  public tipoCard: any[] = [{
    id: '',
    horaInicio: '',
    horaFim: ''
  }];
  public grupoCard = null;
  public card = null;
  public doctor = null;
  
  source: LocalDataSource = new LocalDataSource();

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private _visualizarAtendimento: VisualizarDiaAtendimentoComponent,
    private service: ConfigurarDiaAtendimentoService,
    private encriptyService: EncriptyUtilService,
    private toastrService: NbToastrService) {

    this.tipoCard = [];
    this.grupoCard = [];

    this.listSemana = [
      {
        semana: '1',
        descricao: 'Segunda'
      },
      {
        semana: '2',
        descricao: 'Terça'
      },
      {
        semana: '3',
        descricao: 'Quarta'
      },
      {
        semana: '4',
        descricao: 'Quinta'
      },
      {
        semana: '5',
        descricao: 'Sexta'
      },
      {
        semana: '6',
        descricao: 'Sabado'
      },
      {
        semana: '7',
        descricao: 'Domingo'
      }
    ]

  }
  ngOnDestroy() { }
  ngOnInit() {

    this.activatedRouter.queryParams.subscribe(register => {
      //this.nomeMedico = this.encriptyService.decriptyBySecretKey(register.medico) ;      
      this.doctorId = register[0];
      this.pesquisaMedico(this.doctorId)   
    })
    
    this.verificaHorario(this.doctorId)
   
    this.formDiaAtendimento = this.formBuilder.group({
      semana: [null]
    })

  }

  pesquisaMedico(data) {
    
    this.isActive = true
    let params = new HttpParams();

    params = params.append('doctorId', data)   

    this.service.buscaDoctor(params, (response) => {
      this.listMedico = response[0].id
      this.doctor = response[0].name
      this.isActive = false;

    }, (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);  
    });

  }

  onDeleteConfirm(event) {

    if (window.confirm('Tem certeza que deseja excluir?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event) {
    
    //if (window.confirm('Are you sure you want to create?')) {
    event.confirm.resolve();
    //} else {
    // event.confirm.reject();
    //}

  }

  onSaveConfirm(event) {   
    event.confirm.resolve();
  }

  addHora() {

    this.tipoCard.push({
      id: this.tipoCard.length + 1,      
    })
  }

  removerCard() {

    this.tipoCard.splice(this.tipoCard.indexOf(3), 1);

  }

  salvar(event) {

    let register = {
    doctorId: this.listMedico,
    items: [
      {
        weekday: event.semana,
        timeRangeList: [
          {
            clinicId: null,
            startTime: this.tipoCard[0].horaInicio,
            endTime: this.tipoCard[0].horaFim
          }
        ]
      }
    ]
  }

  this.isActive = true;
    this.service.salveAtenHora(register, (response => {
      this.isActive = false;
      this.toastrService.success('Registro cadastrado com sucesso !!!');
      this.limpaForm()
      this.verificaHorario(this.listMedico)
    }), error => {      
      this.isActive = false;
      this.toastrService.danger(error.error.message); 
    });
   

  }

  limpaForm(){
    this.formDiaAtendimento = this.formBuilder.group({
      semana: [null]
    })
    this.removerCard()
  }

  verificaHorario(data) {
    this.isActive = true
    this.rowData = [];
    
    let params = new HttpParams();
    params = params.append('doctorId', data)

    this.service.agendaDoctor(params, (response) => {

      if(response.length != 0){        
        
        this.rowData = response;

        this.rowData = this.rowData.map(data => {

          if (data.weekday == 1) {
            this.segunda = [data.startTime.concat(' - ', data.endTime)]
          } else if (data.weekday == 2) {
            this.terca = [data.startTime.concat(' - ', data.endTime)]
          } else if (data.weekday == 3) {
            this.quarta = [data.startTime.concat(' - ', data.endTime)]
          } else if (data.weekday == 4) {
            this.quinta = [data.startTime.concat(' - ', data.endTime)]
          } else if (data.weekday == 5) {
            this.sexta = [data.startTime.concat(' - ', data.endTime)]
          } else if (data.weekday == 6) {
            this.sabado = [data.startTime.concat(' - ', data.endTime)]
          } else if (data.weekday == 7) {
            this.domingo = [data.startTime.concat(' - ', data.endTime)]
          }
  
          return {
            nome: data.doctor.name.split(' ')[0],
            segunda: this.segunda,
            terca: this.terca,
            quarta: this.quarta,
            quinta: this.quinta,
            sexta: this.sexta,
            sabado: this.sabado,
            domingo: this.domingo,
          }
        })
        this.isActive = false
      }else{
        this.isActive = false
        this.toastrService.warning('Não possui hora marcada !!!');
      }

    }, (error) => {
      this.toastrService.danger(error.error.message);
    });

  }

  previousPage() {
    this.router.navigate(['/pages/configurar-agenda/visualizar-dia-atendimento'])
  }

}
