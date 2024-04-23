/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { ConfigurarExcecaoAtendimentoService } from './configurar-excecao-atendimento.service';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import * as moment from 'moment';


@Component({
  selector: 'ngx-configurar-excecao-atendimento',
  styleUrls: ['./configurar-excecao-atendimento.component.scss'],
  templateUrl: './configurar-excecao-atendimento.component.html',
})
export class ConfigurarExcecaoAtendimentoComponent implements OnDestroy {

  public formExcecaoAtendimento = null;
  public tipoCard: any[] = [{
    id: '',
    horaInicio: '',
    horaFim: ''
  }];
  public grupoCard = null;
  public card = null;
  public listMedico = null;
  public isCardHoras = false;
  public isActive = false;
  public rowData = null;
  public doctorId = null;
  public horaInicio = [];
  public horaFim = [];
  public clinicaId = null;
  public listClinica = null;
  public listTipoConsulta = [];
  public timeList = [];
  public params = new HttpParams();


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: ConfigurarExcecaoAtendimentoService,
    private toastrService: NbToastrService) {

    this.tipoCard = [];
    this.grupoCard = [];

    this.listTipoConsulta = [{
      id: 1,
      descricao: "Presencial"
    },
    {
      id: 2,
      descricao: "Video Chamada"
    },
    {
      id: 3,
      descricao: "Emergencial Presencial"
    },
    {
      id: 4,
      descricao: "Em Casa"
    },
    {
      id: 5,
      descricao: "Video Chamada Emergencial"
    }];

  }
  ngOnDestroy() { }

  ngOnInit() {

    this.listMedico = JSON.parse(localStorage.getItem('bway-medico'));
    this.listClinica = JSON.parse(localStorage.getItem('bway-clinica'));

    if (this.listMedico && this.listMedico.length > 0) {
      this.verificaMedico(this.listMedico[0].id);
    } else {
      console.error('A lista de médicos está vazia ou não definida!');
     this.toastrService.warning('Sua Sessão foi Encerrada, Efetue um Novo Login','Aditi Care');
    
    {
            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 3000); // 3000 milissegundos = 3 segundos
        }
    }
        //this.params = this.params.append('clinicId', this.listClinica[0].id)
    this.pesquisaClinica(this.listClinica[0].id)
    this.formExcecaoAtendimento = this.formBuilder.group({
      dataExcecao: [null],
      horaInicio: [null],
      horaFim: [null],
      card: [null],
      medico: [this.listMedico[0], Validators.required],
      clinica: [this.listClinica[0], Validators.required],
      tipoConsulta: [null],
    })

    this.formExcecaoAtendimento.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true }); // use the id of the first medico
    this.formExcecaoAtendimento.controls['clinica'].setValue(this.listClinica[0].id, { onlySelf: true }); // use the id of the first clinica

    this.buscarExcecaoDoctor(this.pesquisaClinica)

  }

  addHora() {

    this.tipoCard.push({
      id: this.tipoCard.length + 1,
    })
  }

  removerCard() {

    this.tipoCard.splice(this.tipoCard.indexOf(3), 1);

  }

  expediente(data) {

    if (data === 'S') {
      this.isCardHoras = false
    } else {
      this.isCardHoras = true
    }
  }

  buscarExcecaoDoctor(data) {

    this.params = null;
    
    this.params = this.params.append('doctorId', this.doctorId)

    this.service.buscarExcecaoDoctor(this.params, (response) => {

      this.rowData = response;

      if (response.length != 0) {
        this.rowData = this.rowData.map(data => {
          return {
            nome: data.doctor.name.split(' ')[0],
            data: moment(data.dateException).format("DD/MM/YYYY"),
            horaInicio: data.startTime == null ? 'Sem Expediente' : data.startTime,
            horaFim: data.endTime == null ? 'Sem Expediente' : data.endTime,
            nomeClinica: data.clinic.socialName == null ? 'Não Informada' : data.clinic.socialName,
            description:data.typeService.description,
            id: data.id

          }
        })
      } else {
        null;
      }

    }, (error) => {
      this.toastrService.danger(error.error.message);
    });

  }

  deletar(data){

    this.isActive = true;

    this.service.removeExcecaoDoctor(data, (response => {
      this.isActive = false;
      this.toastrService.success('Registro Removido com Sucesso','Aditi Care!');
      this.buscarExcecaoDoctor(this.doctorId)
    }), (error) => {
      if(error=== 'OK'){
        this.toastrService.success('Registro Removido com Sucesso','Aditi Care!');
        this.buscarExcecaoDoctor(this.doctorId)

      }else{
        this.toastrService.danger('Ocorreu um Erro, Tente Novamente Mais Tarde','Aditi Care!');
      }
    });
    this.isActive = false;
  }

  salvar(data) {

    for (var i = 0; i < this.tipoCard.length; i++) {

      this.timeList.push({
        startTime: this.tipoCard[i].horaInicio,
        endTime: this.tipoCard[i].horaFim
      })
    }

    let register =
    {
      doctorId: this.doctorId,
      clinicId: this.clinicaId,
      timeList: this.timeList,
      away: this.isCardHoras,
      typeServiceId: data.tipoConsulta,
      dateException: data.dataExcecao
    }


    if ((this.doctorId != null) && (data.dataExcecao != null) && ((this.isCardHoras == true) || (this.isCardHoras == false))) {

      this.isActive = true;

      this.service.salvarExcecaoDoctor(register, (response => {
        this.isActive = false;
        this.toastrService.success('Registro cadastrado com sucesso !!!','Aditi Care!');
        this.buscarExcecaoDoctor(response[0].doctor.id)
        this.limpaForm()
      }), (error) => {
        this.isActive = false;
        this.toastrService.danger(error.message);
      });
    } else {
      this.toastrService.danger('Preencher os campos obrigatório!!!','Aditi Care!');
    }

    this.horaInicio = [];
    this.horaFim = [];

  }

  limpaForm() {

    this.formExcecaoAtendimento = this.formBuilder.group({
      dataExcecao: [null],
      horaInicio: [null],
      horaFim: [null],
      card: [null],
      medico: [null],
      clinica: [null],
      tipoConsulta: [null]
    })

    this.removerCard()
  }

  verificaMedico(data) {

    if (data != 'null') {
      this.doctorId = data
      this.params = this.params.append('doctorId', data)
    } else {
      this.toastrService.danger('Preencher o campo obrigatório!!!','Aditi Care!');
    }

  }

  pesquisaClinica(data) {

    if (data != 'null ') {
      this.clinicaId = data

    } else {
      this.service.buscaClinica(data, null, (response) => {

        this.listClinica = response
        this.isActive = false
  
      }, (error) => {
        this.isActive = false;
        this.toastrService.danger(error.message);
      });
      }

   
  }

  verificaClinica(data) {
    this.clinicaId = data;
  }

}
