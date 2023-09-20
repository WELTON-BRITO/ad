import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-parametrizar-consulta',
  styleUrls: ['./parametrizar-consulta.component.scss'],
  templateUrl: './parametrizar-consulta.component.html',
})
export class ParametrizarConsultaComponent implements OnDestroy {

  public formParametrizarConsulta = null;
  public listMedico = null;
  public checkPresencial = null;
  public checkVideo = null;
  public checkEmergencial = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router) {

    this.listMedico = [
      {
        medico: '1',
        descricao: 'Welton Luiz de Almeida Brito'
      },
      {
        medico: '2',
        descricao: 'Camila Marcia Parreira Silva'
      },
      {
        medico: '3',
        descricao: 'Ryan Carlos Silva Almeida Brito'
      },
      {
        medico: '4',
        descricao: 'Yasmim Vitória Silva Almeida Brito'
      }
    ]

  }
  ngOnDestroy() { }
  ngOnInit() {

    this.formParametrizarConsulta = this.formBuilder.group({
      valorPresencial: [null],
      valorEmergencial: [null],
      valorVideo: [null],
      tempoPresencial: [null],
      tempoVideo: [null],
      tempoEmergencial: [null],
      medico: [null],
    })

  }

  funcValor(event, element) {

    if (element.checked == true) {
      if (event == "P") {
        this.checkPresencial = event;
      } else if (event == "V") {
        this.checkVideo = event;
      } else if (event == "E") {
        this.checkEmergencial = event
      }
    } else if (element.checked == false) {
      if (event == "P") {
        this.checkPresencial = null;
      } else if (event == "V") {
        this.checkVideo = null;
      } else if (event == "E") {
        this.checkEmergencial = null;
      }

    }

  }

  salvar(data) {
    console.log(data)
    console.log(this.checkEmergencial)
    console.log(this.checkVideo)
    console.log(this.checkPresencial)
  }

}
