import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { EncriptyUtilService } from '../../shared/services/encripty-util.services';
import { VisualizarDiaAtendimentoService } from './visualizar-dia-atendimento.service';

@Component({
  selector: 'ngx-visualizar-dia-atendimento',
  styleUrls: ['./visualizar-dia-atendimento.component.scss'],
  templateUrl: './visualizar-dia-atendimento.component.html',
})
export class VisualizarDiaAtendimentoComponent implements OnDestroy {

  public formVisualizarDiaAtendimento = null;

  settings = {
    actions: false,
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: false,
    hideSubHeader: true,
    columns: {
      name: {
        title: 'Nome',
        type: 'name',
      },
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

  cartData = [
    {
      id: "1",
      name: "Welton Luiz de Almeida Brito",
      Segunda: "06:00 - 11:50",
      Terca: "13:50 - 18:50",
      Quarta: "11:50 - 12:50",
      Quinta: "10:50 - 11:50",
      Sexta: "10:50 - 11:50",
      Sabado: "",
      Domingo: "",
    },
    {
      id: "1",
      name: "Welton Luiz de Almeida Brito",
      Segunda: "13:00 - 15:50",
      Terca: "08:50 - 11:50",
      Quarta: "",
      Quinta: "15:50 - 18:50",
      Sexta: "",
      Sabado: "",
      Domingo: "",
    },
    {
      id: "1",
      name: "Welton Luiz de Almeida Brito",
      Segunda: "",
      Terca: "08:50 - 11:50",
      Quarta: "",
      Quinta: "",
      Sexta: "",
      Sabado: "15:50 - 18:50",
      Domingo: "06:30 - 13:30",
    },
    {
      id: "1",
      name: "Welton Luiz de Almeida Brito",
      Segunda: "",
      Terca: "13:50 - 15:50",
      Quarta: "",
      Quinta: "",
      Sexta: "",
      Sabado: "08:50 - 11:50",
      Domingo: "16:30 - 18:30",
    },
    {
      id: "2",
      name: "Camila Marcia Parreira Silva",
      Segunda: "10:50 - 11:50",
      Terca: "11:50 - 12:50",
      Quarta: "11:50 - 12:50",
      Quinta: "10:50 - 11:50",
      Sexta: "10:50 - 11:50",
    },
    {
      id: "3",
      name: "Ryan Carlos Silva Almeida Brito",
      Segunda: "10:50 - 11:50",
      Terca: "11:50 - 12:50",
      Quarta: "11:50 - 12:50",
      Quinta: "10:50 - 11:50",
      Sexta: "10:50 - 11:50",
    },
    {
      id: "4",
      name: "Yasmim Vitória Silva Almeida Brito",
      Terça: "10:50 - 11:50",
      Terca: "11:50 - 12:50",
      Quarta: "11:50 - 12:50",
      Quinta: "10:50 - 11:50",
      Sexta: "10:50 - 11:50",
    },
  ];

  public listMedico = null;
  public listSemana = null; 
  public rowData: any = [];

  source: LocalDataSource = new LocalDataSource();

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: VisualizarDiaAtendimentoService,
    private encriptyService: EncriptyUtilService) {   

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

    this.pesquisaMedico();

    this.formVisualizarDiaAtendimento = this.formBuilder.group({
      medico: [null],
    })

  }

  configAtendimento(event) {
    console.log(event)
    //console.log(this.rowData)
    //this.teste1 = this.rowData
    //console.log(this.teste1)
    //let name = this.encriptyService.encriptyBySecretKey(event)
    console.log(name)
    this.router.navigate(['/pages/configurar-agenda/configurar-dia-atendimento'], { queryParams: event });
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

  pesquisar(data) { 

    console.log(data)

    for (let item of this.cartData) {
      
      if (item.name == data.medico) {

        this.rowData = this.cartData.filter(teste => teste.id === item.id);      
        this.source = new LocalDataSource(this.rowData);
        //this.teste1 = this.rowData
        //console.log(this.teste1)
      }
    }

  }

}
