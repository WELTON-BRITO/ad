import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ParametrizarConsultaService } from './parametrizar-consulta.service';

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
    private router: Router,
    private service: ParametrizarConsultaService) {
  }

  ngOnDestroy() { }
  ngOnInit() {

    this.pesquisaMedico();
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

  salvar(data) {
    console.log(data)

    let register = {

      valueInPerson: data.valorPresencial,
      valueRemote: data.valorVideo,
      doctorId: data.medico,
      valueInPersonEmergency: data.valorEmergencial,
      valueAtHome: '3.0',
      durationInPerson: data.tempoPresencial,
      durationAtHome: '3.0',
      durationRemote: data.tempoVideo,
      durationEmergency: data.tempoEmergencial,
      qrCode: '',
      pixCode: '',

    }

    console.log(register)

    this.service.cadastrarPriceDoctor(register, (response => {
      console.log(response)
    }), error => {

      console.log(error)

    });

  }

}
