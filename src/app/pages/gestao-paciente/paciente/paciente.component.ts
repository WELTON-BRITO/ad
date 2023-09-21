import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from './paciente.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'ngx-paciente',
  styleUrls: ['./paciente.component.scss'],
  templateUrl: './paciente.component.html',
})
export class PacienteComponent implements OnInit {

  public formPaciente = null;
  public listPaciente = null;
  public rowData = null;
  public listMedico = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: PacienteService) { }

  ngOnInit() {
    console.log('entrei')
    this.pesquisaMedico();

    this.formPaciente = this.formBuilder.group({
      pesquisa: [null],
      medico: [null]
    })

    this.rowData = [
      {
        img: '<img  class="w-25" src="assets/images/teste-imagem.png"/>',
        nome: " Welton Luiz de Almeida Brito",
        telefone: "34-98825-3972",
        codigo: "01",
        ultimaConsulta: "01/02/2023",
        dataNascimento: "19/06/1981",
        convenio: "Unimed",
      },
      {
        img: '<img  class="w-25" src="assets/images/teste-imagem.png"/>',
        nome: "Camila Marcia Parreira Silva",
        telefone: "34-98825-3972",
        codigo: "01",
        ultimaConsulta: "01/02/2023",
        dataNascimento: "19/06/1981",
        convenio: "Unimed",
      },
      {
        img: '<img  class="w-25" src="assets/images/teste-imagem.png"/>',
        nome: "Ryan Carlos Silva Almeida Brito",
        telefone: "34-98825-3972",
        codigo: "01",
        ultimaConsulta: "01/02/2023",
        dataNascimento: "19/06/1981",
        convenio: "Unimed",
      },
      {
        img: '<img  class="w-25" src="assets/images/teste-imagem.png"/>',
        nome: "Yasmim Vitoria Silva Almeida Brito",
        telefone: "34-98825-3972",
        codigo: "01",
        ultimaConsulta: "01/02/2023",
        dataNascimento: "19/06/1981",
        convenio: "Unimed",
      },
      {
        img: '<img  class="w-25" src="assets/images/teste-imagem.png"/>',
        nome: "Welton Luiz de Almeida Brito",
        telefone: "34-98825-3972",
        codigo: "01",
        ultimaConsulta: "01/02/2023",
        dataNascimento: "19/06/1981",
        convenio: "Unimed",
      },
    ]

  }

  pesquisaGeral(data) {
    console.log(data)

    let params = new HttpParams();

    params = params.append('doctorId', data.medico)

    if (data.cnpjCpf != null) {
      params = params.append('name', data.cnpjCpf)
    }

    if (data.cnpjCpf != null) {
      params = params.append('federalId', data.cnpjCpf)
    }

    this.service.buscaPaciente(params, (response) => {

      console.log(response)

      ///this.rowData = response

      /*this.rowData = this.rowData.map(data => {
        return {
          nome: data.name,
                     
        }
      })*/


    }, (error) => {
      console.log(error)
      //this.notifications.error(error.message);        
    });

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

  novoPaciente() {

    console.log('entrei aqui')
    this.router.navigate(['/pages/gestao-paciente/novo-paciente']);
  }
}
