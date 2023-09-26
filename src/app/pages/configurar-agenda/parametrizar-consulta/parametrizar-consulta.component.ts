import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ParametrizarConsultaService } from './parametrizar-consulta.service';
import { NbToastrService } from '@nebular/theme';

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
  public isActive = true;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: ParametrizarConsultaService,
    private toastrService: NbToastrService) {
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

      this.listMedico = response
      this.isActive = false

    }, (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);
    });

  }

  salvar(data) {

    let register = {

      valueInPerson: data.valorPresencial,
      valueRemote: data.valorVideo,
      doctorId: data.medico,
      valueInPersonEmergency: data.valorEmergencial,
      valueAtHome: null,
      durationInPerson: data.tempoPresencial,
      durationAtHome: null,
      durationRemote: data.tempoVideo,
      durationEmergency: data.tempoEmergencial,
      qrCode: '',
      pixCode: '',

    }

    this.isActive = true;

    this.service.cadastrarPriceDoctor(register, (response => {
      this.isActive = false;
      this.toastrService.success('Registro cadastrado com sucesso !!!');
      this.limpaForm()
    }), error => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);
    });

  }

  limpaForm() {

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


}
