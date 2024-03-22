import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  public listModalidade: Array<number> = [];
  public modalidadeId = [];
  public segundaId = null;
  public tercaId = null;
  public quartaId = null;
  public quintaId = null;
  public sextaId = null;
  public sabadoId = null;
  public domingoId = null;
  public mostrarDiv = false;

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

    this.listClinica = JSON.parse(sessionStorage.getItem('bway-clinica'));
    this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));

    this.formDiaAtendimento = this.formBuilder.group({
      semana: [null],
      tipoModalidade: [null],
      medico: [this.listMedico[0], Validators.required],
      clinica: [this.listClinica[0], Validators.required],
    })

    this.formDiaAtendimento.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });

    this.formDiaAtendimento.controls['clinica'].setValue(this.listClinica[0].id, { onlySelf: true }); // use the id of the first clinica

    this.buscaModalidade(this.listMedico[0].id)

    this.doctorId= this.listMedico[0].id;

    this.clinicaId = this.listClinica[0].id

  }

  verificaClinica(data) {
    this.clinicaId = data;
  //  this.verificaHorario(this.doctorId, this.clinicaId)
  }

  addHora() {

    this.mostrarDiv= true;

    this.tipoCard.push({
      id: this.tipoCard.length + 1,
    })
    
  }

  removerCard() {

    this.tipoCard.splice(this.tipoCard.indexOf(3), 1);
    this.mostrarDiv=false;
  }

  salvar(event) {

    this.timeRange = []

    if(this.modalidadeId.length==0){

      this.toastrService.warning('Favor Informar a Modalidade de Atendimento','Aditi Care');

    }
    else if (this.tipoCard[0].horaFim == null || this.tipoCard[0].horaInicio == null || this.tipoCard[0].horaFim === '' || this.tipoCard[0].horaInicio === '') {
      this.toastrService.warning('Favor Informar o Horário de Atendimento', 'Aditi Care');
  }
   else if ((event.semana == null || event.semana == 'null') || (event.clinica == null || event.clinica == 'null')) {

        this.toastrService.warning('Favor Informar Dia de Atendimento','Aditi Care');

      } else {

        for (var j = 0; j < this.modalidadeId.length; j++) {

          for (var i = 0; i < this.tipoCard.length; i++) {
    
            this.timeRange.push(
              {
                clinicId: this.clinicaId,
                startTime: this.tipoCard[i].horaInicio,
                endTime: this.tipoCard[i].horaFim,
                typeServiceId: this.modalidadeId[j]
              }
            )    
          }
        }    

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
            this.toastrService.success('Horario Configurado com Sucesso','Aditi Care!');
            this.previousPage()

        }), (error) => {
          this.isActive = false;
          
            this.toastrService.danger(error.error.message);
    
        });

      }

    
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

  verificaMedico(data) {

    for (var i = 0; i < this.listMedico.length; i++) {

      if (data == this.listMedico[i].id) {
        this.doctorId = this.listMedico[i].id
      }
    }
  }

  tipoModalidade(data, element) {

    if (element.checked == true) {
      for (var i = 0; i < data; i++) {
        if (data[i] != undefined) {
          this.modalidadeId.push(data)
        }
      }
    } else {
      let DX = this.modalidadeId.findIndex(el => el === data)
      this.modalidadeId.splice(DX, 1)
    }

  }

}
