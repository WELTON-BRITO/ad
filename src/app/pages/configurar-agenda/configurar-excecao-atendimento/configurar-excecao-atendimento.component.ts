import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Console } from 'console';
import { LocalDataSource } from 'ng2-smart-table';
import { ConfigurarExcecaoAtendimentoService } from './configurar-excecao-atendimento.service';
import { HttpParams } from '@angular/common/http';


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
  public isCardHoras = true;

  settings = {
    actions: false,
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: true,
    columns: {
      name: {
        title: 'Pesquisa por nome',
        type: 'name',
      },
      date: {
        title: 'Pesquisa por data',
        type: 'date',
      },
      horaInicio: {
        title: 'Pesquisa por hora início',
        type: 'hora',
      },
      horaFim: {
        title: 'Pesquisa por hora fim',
        type: 'hora',
      },
    },
  };

  cartData = [
    {
      id: "1",
      name: "Welton Luiz de Almeida Brito",
      date: "14/08/2023",
      horaInicio: "10:50",
      horaFim: "11:50"
    },
    {
      id: "2",
      name: "Camila Marcia",
      date: "02/08/2023",
      horaInicio: "05:00",
      horaFim: "06:00"
    },
    {
      id: "3",
      name: "Ryan Carlos",
      date: "12/08/2023",
      horaInicio: "11:50",
      horaFim: "12:00"
    },
    {
      id: "4",
      name: "Yasmim Vitória",
      date: "20/08/2023",
      horaInicio: "09:50",
      horaFim: "10:00"
    },
    {
      id: "5",
      name: "Welton Luiz de Almeida Brito",
      date: "14/08/2023",
      horaInicio: "10:50",
      horaFim: "12:00"
    },
    {
      id: "6",
      name: "Camila Marcia",
      date: "02/08/2023",
      horaInicio: "05:00",
      horaFim: "06:00"
    },
    {
      id: "7",
      name: "Ryan Carlos",
      date: "12/08/2023",
      horaInicio: "11:50",
      horaFim: "12:00"
    },
    {
      id: "8",
      name: "Yasmim Vitória",
      date: "20/08/2023",
      horaInicio: "09:50",
      horaFim: "10:00"
    },
    {
      id: "9",
      name: "Welton Luiz de Almeida Brito",
      date: "14/08/2023",
      horaInicio: "10:50",
      horaFim: "11:00"
    },
    {
      id: "10",
      name: "Camila Marcia",
      date: "02/08/2023",
      horaInicio: "05:00",
      horaFim: "06:00"
    },
    {
      id: "11",
      name: "Ryan Carlos",
      date: "12/08/2023",
      horaInicio: "11:50",
      horaFim: "12:00"
    },
    {
      id: "12",
      name: "Yasmim Vitória",
      date: "20/08/2023",
      horaInicio: "09:50",
      horaFim: "10:00"
    }
  ];

  source: LocalDataSource = new LocalDataSource(this.cartData);

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: ConfigurarExcecaoAtendimentoService) {

    //this.source = new LocalDataSource(this.cartData)
    this.tipoCard = [];
    this.grupoCard = [];    

  }
  ngOnDestroy() { }
  ngOnInit() {

    this.pesquisaMedico();

    this.formExcecaoAtendimento = this.formBuilder.group({
      dataExcecao: [null],
      horaInicio: [null],
      horaFim: [null],
      card: [null],
      medico: [null]
    })

  }

  onDeleteConfirm(event) {
    
    if (window.confirm('Tem certeza que deseja excluir?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event) {

    console.log(event.data);
    //if (window.confirm('Are you sure you want to create?')) {
    event.confirm.resolve();
    //} else {
    // event.confirm.reject();
    //}

  }

  onSaveConfirm(event) {
    console.log(event.data);
    event.confirm.resolve();
  }

  addHora() {

    this.tipoCard.push({
      id: this.tipoCard.length + 1,
      horaInicio: '',
      horaFim: ''
    })
  }

  removerCard(){

    this.tipoCard.splice(this.tipoCard.indexOf(3), 1);         
     
  }

  expediente(data){
    console.log(data)

    if(data === 'S'){
      console.log('tem expediente')
      this.isCardHoras = true
    }else{
      console.log('não terá expediente')
      this.isCardHoras = false
    }
  }

  pesquisaMedico() {

    this.service.buscaDoctor(null, (response) => {

      for (var i = 0; i < response.length; i++) {

        this.listMedico = [
          {
            medico: response[i].id,
            descricao: response[i].name,
          }
        ]

      }

    }, (error) => {
      console.log(error)
    });

  }

  buscarExcecaoDoctor(data){

    let params = new HttpParams();

    params = params.append('doctorId', data.medico)

    this.service.buscarExcecaoDoctor(null, (response) => {

      for (var i = 0; i < response.length; i++) {

        this.listMedico = [
          {
            medico: response[i].id,
            descricao: response[i].name,
          }
        ]

      }

    }, (error) => {
      console.log(error)
    });

  }

  salvar(data) {
    console.log(data)
    console.log(this.tipoCard)

   /* for (let i = 0; i < this.tipoCard.length; i++) {

      this.card = this.tipoCard[i]
      
    }
    console.log(this.card)*/
   
  }

}
