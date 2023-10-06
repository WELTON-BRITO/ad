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
  public semana = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private service: ConfigurarDiaAtendimentoService,
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
      this.doctorId = register.medico;
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

    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);
    });

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

    if (this.tipoCard.length <= 0)  {      
      this.toastrService.warning('Não é possível salvar horário de atendimento sem marcar a hora!!!');
    } else {

      let register = {
        doctorId: this.listMedico,
        items: [
          {
            weekday: event.semana != null ? event.semana : this.semana,
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
  
      console.log(register)

      this.isActive = true;
      this.service.salveAtenHora(register, (response => {
        this.isActive = false;
        this.toastrService.success('Registro cadastrado com sucesso !!!');
        this.limpaForm()
        this.verificaHorario(this.listMedico)
      }), message => {
        this.isActive = false;
        this.toastrService.danger(message);
      });

    }
  }

  limpaForm() {
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

      if (response.length != 0) {

        this.rowData = response;

        this.rowData = this.rowData.map(data => {

          if (data.weekday == 1) {
            this.segunda = [data.startTime.concat(' - ', data.endTime)]   
            this.terca = null;
            this.quarta = null;
            this.quinta = null;
            this.sexta = null;
            this.sabado = null;
            this.domingo = null;
          } else if (data.weekday == 2) {
            this.terca = [data.startTime.concat(' - ', data.endTime)]  
            this.segunda = null;
            this.quarta = null;
            this.quinta = null;
            this.sexta = null;
            this.sabado = null;
            this.domingo = null;          
          } else if (data.weekday == 3) {
            this.quarta = [data.startTime.concat(' - ', data.endTime)] 
            this.segunda = null;
            this.terca = null;
            this.quinta = null;
            this.sexta = null;
            this.sabado = null;
            this.domingo = null;              
          } else if (data.weekday == 4) {
            this.quinta = [data.startTime.concat(' - ', data.endTime)]  
            this.segunda = null;
            this.terca = null;
            this.quarta = null;
            this.sexta = null;
            this.sabado = null;
            this.domingo = null;             
          } else if (data.weekday == 5) {
            this.sexta = [data.startTime.concat(' - ', data.endTime)]    
            this.segunda = null;
            this.terca = null;
            this.quarta = null;
            this.quinta = null;
            this.sabado = null;
            this.domingo = null;           
          } else if (data.weekday == 6) {
            this.sabado = [data.startTime.concat(' - ', data.endTime)]    
            this.segunda = null;
            this.terca = null;
            this.quarta = null;
            this.quinta = null;
            this.sexta = null;
            this.domingo = null;            
          } else if (data.weekday == 7) {
            this.domingo = [data.startTime.concat(' - ', data.endTime)]  
            this.segunda = null;
            this.terca = null;
            this.quarta = null;
            this.quinta = null;
            this.sexta = null;
            this.sabado = null;              
          }

          return {
            id: data.weekday,
            segunda: this.segunda,
            terca: this.terca,
            quarta: this.quarta,
            quinta: this.quinta,
            sexta: this.sexta,
            sabado: this.sabado,
            domingo: this.domingo,
          }
        })
        console.log(this.rowData)

        this.isActive = false
      } else {
        this.isActive = false
        this.toastrService.warning('Não possui hora marcada !!!');
      }

    }, (message) => {
      this.toastrService.danger(message);
    });

  }

  editar(data) {
    console.log(data)

    this.semana = data.id;

    this.addHora();
  }

  previousPage() {
    this.router.navigate(['/pages/configurar-agenda/visualizar-dia-atendimento'])
  }

}
