import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
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
  public listClinica = null;
  public tipoCard: any[] = [{
    id: '',
    horaInicio: '',
    horaFim: ''
  }];
  public grupoCard = null;
  public card = null;
  public doctor = null;
  public semana = null;
  public horaInicio = [];
  public horaFim = [];
  public timeRange = [];
  public clinicaId = null;
  public listModalidade = null;
  public modalidadeId = null;
  public segundaId = null;
  public tercaId = null;
  public quartaId = null;
  public quintaId = null;
  public sextaId = null;
  public sabadoId = null;
  public domingoId = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
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

    this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));
    let data = history.state

    for (var i = 0; i < this.listMedico.length; i++) {
      if (data.medico == this.listMedico[i].id) {
        this.doctorId = this.listMedico[i].id
        this.doctor = this.listMedico[i].name
      }
    }

    this.verificaHorario(this.doctorId, data.clinica)
    this.pesquisaClinica(this.doctorId)
    this.buscaModalidade(this.doctorId)
    this.formDiaAtendimento = this.formBuilder.group({
      semana: [null],
      clinica: [null],
      tipoModalidade: [null]
    })

  }

  pesquisaClinica(data) {

    this.service.buscaClinica(data, null, (response) => {

      this.listClinica = response
      this.isActive = false

    }, (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);
    });

  }

  verificaClinica(data) {
    this.clinicaId = data;
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

    this.timeRange = []
    for (var i = 0; i < this.tipoCard.length; i++) {
      this.timeRange.push(
        {
          clinicId: this.clinicaId,
          startTime: this.tipoCard[i].horaInicio,
          endTime: this.tipoCard[i].horaFim,
          typeServiceId: this.modalidadeId
        }
      )
    }

    if (this.tipoCard.length <= 0) {
      this.toastrService.warning('Não é possível salvar horário de atendimento sem marcar a hora!!!');
    } else {

      let register = {
        doctorId: this.doctorId,
        items: [
          {
            weekday: event.semana != null ? event.semana : this.semana,
            timeRangeList: this.timeRange
          }
        ]
      }

      this.isActive = true;
      this.service.salveAtenHora(register, (response => {
        this.isActive = false;
        this.toastrService.success('Registro cadastrado com sucesso !!!');
        this.limpaForm()
        this.verificaHorario(this.doctorId, this.clinicaId)
      }), (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);
      });

    }
  }

  limpaForm() {
    this.formDiaAtendimento = this.formBuilder.group({
      semana: [null],
      clinica: [null]
    })
    this.tipoCard.splice(null);
  }

  verificaHorario(data, element) {

    this.isActive = true
    this.rowData = [];

    let params = new HttpParams();
    params = params.append('doctorId', data)
    params = params.append('clinicId', element)

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
            this.segundaId = data.id;
            this.tercaId = null;
            this.quartaId = null;
            this.quintaId = null;
            this.sextaId = null;
            this.sabadoId = null;
            this.domingoId = null;
          } else if (data.weekday == 2) {
            this.terca = [data.startTime.concat(' - ', data.endTime)]
            this.segunda = null;
            this.quarta = null;
            this.quinta = null;
            this.sexta = null;
            this.sabado = null;
            this.domingo = null;
            this.tercaId = data.id;
            this.segundaId = null;
            this.quartaId = null;
            this.quintaId = null;
            this.sextaId = null;
            this.sabadoId = null;
            this.domingoId = null;
          } else if (data.weekday == 3) {
            this.quarta = [data.startTime.concat(' - ', data.endTime)]
            this.segunda = null;
            this.terca = null;
            this.quinta = null;
            this.sexta = null;
            this.sabado = null;
            this.domingo = null;
            this.quartaId = data.id;
            this.segundaId = null;
            this.tercaId = null;
            this.quintaId = null;
            this.sextaId = null;
            this.sabadoId = null;
            this.domingoId = null;
          } else if (data.weekday == 4) {
            this.quinta = [data.startTime.concat(' - ', data.endTime)]
            this.segunda = null;
            this.terca = null;
            this.quarta = null;
            this.sexta = null;
            this.sabado = null;
            this.domingo = null;
            this.quintaId = data.id;
            this.segundaId = null;
            this.tercaId = null;
            this.quartaId = null;
            this.sextaId = null;
            this.sabadoId = null;
            this.domingoId = null;
          } else if (data.weekday == 5) {
            this.sexta = [data.startTime.concat(' - ', data.endTime)]
            this.segunda = null;
            this.terca = null;
            this.quarta = null;
            this.quinta = null;
            this.sabado = null;
            this.domingo = null;
            this.sextaId = data.id;
            this.segundaId = null;
            this.tercaId = null;
            this.quartaId = null;
            this.quintaId = null;
            this.sabadoId = null;
            this.domingoId = null;
          } else if (data.weekday == 6) {
            this.sabado = [data.startTime.concat(' - ', data.endTime)]
            this.segunda = null;
            this.terca = null;
            this.quarta = null;
            this.quinta = null;
            this.sexta = null;
            this.domingo = null;
            this.sabadoId = data.id;
            this.segundaId = null;
            this.tercaId = null;
            this.quartaId = null;
            this.quintaId = null;
            this.sextaId = null;
            this.domingoId = null;
          } else if (data.weekday == 7) {
            this.domingo = [data.startTime.concat(' - ', data.endTime)]
            this.segunda = null;
            this.terca = null;
            this.quarta = null;
            this.quinta = null;
            this.sexta = null;
            this.sabado = null;
            this.domingoId = data.id;
            this.segundaId = null;
            this.tercaId = null;
            this.quartaId = null;
            this.quintaId = null;
            this.sextaId = null;
            this.sabadoId = null;
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
            segundaId: this.segundaId,
            tercaId: this.tercaId,
            quartaId: this.quartaId,
            quintaId: this.quintaId,
            sextaId: this.sextaId,
            sabadoId: this.sabadoId,
            domingoId: this.domingoId,
          }
        })
        this.isActive = false
      } else {
        this.isActive = false
        this.toastrService.warning('Não possui hora marcada !!!');
      }

    }, (error) => {
      this.toastrService.danger(error.error.message);
    });

  }

  excluir(event) {

    if (event.segundaId != null) {
      var id = event.segundaId;
    } else if (event.tercaId != null) {
      var id = event.tercaId;
    } else if (event.quartaId != null) {
      var id = event.quartaId;
    } else if (event.quintaId != null) {
      var id = event.quintaId;
    } else if (event.sextaId != null) {
      var id = event.sextaId;
    } else if (event.sabadoId != null) {
      var id = event.sabadoId;
    } else if (event.domingoId != null) {
      var id = event.domingoId;
    }

    this.isActive = true;
    this.service.delete(id, (response => {
      this.isActive = false;
      this.toastrService.success('Registro removido com sucesso !!!');
      this.verificaHorario(this.doctorId, this.clinicaId)
    }), (error) => {
      this.verificaHorario(this.doctorId, this.clinicaId)
      this.isActive = false;
      this.toastrService.danger(error.error.message);
    });

  }

  previousPage() {
    this.router.navigate(['/pages/configurar-agenda/visualizar-dia-atendimento'])
  }

  buscaModalidade(data) {

    this.service.buscaModalidade(data, null, (response => {
      this.listModalidade = response
    }), (error) => {
      this.toastrService.danger(error.error.message);
    });

  }

  verificaModalidade(data) {
    this.modalidadeId = data
  }

}
