import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-paciente',
  styleUrls: ['./paciente.component.scss'],
  templateUrl: './paciente.component.html',
})
export class PacienteComponent implements OnInit {

  public formPaciente = null;
  public listPaciente = null;
  public rowData = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit() {

    this.formPaciente = this.formBuilder.group({
      pesquisa: [null]
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
      {
        img: '<img  class="w-25" src="assets/images/teste-imagem.png"/>',
        nome: "Welton Luiz de Almeida Brito",
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
      {
        img: '<img  class="w-25" src="assets/images/teste-imagem.png"/>',
        nome: "Welton Luiz de Almeida Brito",
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
      {
        img: '<img  class="w-25" src="assets/images/teste-imagem.png"/>',
        nome: "Welton Luiz de Almeida Brito",
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
      {
        img: '<img  class="w-25" src="assets/images/teste-imagem.png"/>',
        nome: "Welton Luiz de Almeida Brito",
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
      {
        img: '<img  class="w-25" src="assets/images/teste-imagem.png"/>',
        nome: "Welton Luiz de Almeida Brito",
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
      }
    ]

  }

  pesquisaGeral(data){

  }

  novoPaciente(){

    console.log('entrei aqui')
    this.router.navigate(['/pages/gestao-paciente/novo-paciente']);
  }
}
