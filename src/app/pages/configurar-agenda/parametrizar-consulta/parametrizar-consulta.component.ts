/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ParametrizarConsultaService } from './parametrizar-consulta.service';
import { NbToastrService } from '@nebular/theme';
import { HttpParams } from '@angular/common/http';

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
  public checkCasa = null;
  public isActive = false;
  public durationAtHome = null;
  public durationEmergency = null;
  public durationInPerson = null;
  public durationRemote = null;
  public valueAtHome = null;
  public valueInPerson = null;
  public valueInPersonEmergency = null;
  public valueRemote = null;
  public checked = false;
  public atualizar = null;
  public listClinica = null;
  public clinicaId = null;
  public listConsulta = [];
  public modalidade = [];
  public isBloqueio = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: ParametrizarConsultaService,
    private toastrService: NbToastrService) {
  }

  ngOnDestroy() { }
  ngOnInit() {

    this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));
    var name = localStorage.getItem('bway-domain');

    if (name == 'CLINIC') {
      this.isBloqueio = true;
    } else {
      this.isBloqueio = false;
    }

    this.formParametrizarConsulta = this.formBuilder.group({
      valorPresencial: [null],
      valorEmergencial: [null],
      valorVideo: [null],
      valorCasa: [null],
      tempoPresencial: [null],
      tempoVideo: [null],
      tempoEmergencial: [null],
      tempoCasa: [null],
      medico: [this.listMedico[0], Validators.required],
      qrCasa: [null],
      qrEmergencial: [null],
      qrVideo: [null],
      qrPresencial: [null],
      clinica: [null],
      optPresencial: [null],
      optVideo: [null],
      optEmergencial: [null],
      optCasa: [null],
    })
    this.formParametrizarConsulta.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });

    this.pesquisaClinica(this.listMedico[0].id)

  }

  funcValor(event, element) {

    if (element.checked == true) {

      if (event == "1") {
        this.checkPresencial = event;
      } else if (event == "2") {
        this.checkVideo = event;
      } else if (event == "3") {
        this.checkEmergencial = event
      } else if (event == "4") {
        this.checkCasa = event
      }
    } else if (element.checked == false) {
      if (event == "1") {
        this.checkPresencial = null;
      } else if (event == "2") {
        this.checkVideo = null;
      } else if (event == "3") {
        this.checkEmergencial = null;
      } else if (event == "4") {
        this.checkCasa = null
      }

    }

  }

  salvar(data) {

    if ((data.medico == null) || ((data.valorPresencial == null) && (data.valorEmergencial == null) &&
      (data.valorVideo == null) && (data.valorCasa == null)) || ((data.tempoEmergencial == null) &&
        (data.tempoPresencial == null) && (data.tempoVideo == null) && (data.tempoCasa == null))
      || ((this.isBloqueio == true) && (data.optPresencial == null || data.optVideo == null || data.optEmergencial == null || data.optCasa == null))) {

      this.toastrService.danger('Preencher os campos obrigatórios!!!');

    } else {

      if (data.tempoPresencial != null) {

        this.listConsulta.push(
          {
            typeServiceId: 1,
            duration: data.tempoPresencial,
            value: data.valorPresencial,
            qrCode: data.qrPresencial,
            qrCodeBlocked: data.optPresencial == null ? true : data.optPresencial,
            clinicId: this.clinicaId
          }
        )
      }

      if (data.tempoVideo != null) {

        this.listConsulta.push(
          {
            typeServiceId: 2,
            duration: data.tempoVideo,
            value: data.valorVideo,
            qrCode: data.qrVideo,
            qrCodeBlocked: data.optVideo == null ? true : data.optVideo,
            clinicId: this.clinicaId
          }
        )
      }

      if (data.tempoEmergencial != null) {

        this.listConsulta.push(
          {
            typeServiceId: 3,
            duration: data.tempoVideo,
            value: data.valorVideo,
            qrCode: data.qrVideo,
            qrCodeBlocked: data.optEmergencial == null ? true : data.optEmergencial,
            clinicId: this.clinicaId
          }
        )
      }

      if (data.tempoCasa != null) {

        this.listConsulta.push(
          {
            typeServiceId: 4,
            duration: data.tempoCasa,
            value: data.valorCasa,
            qrCode: data.qrCasa,
            qrCodeBlocked: data.optCasa == null ? true : data.optCasa,
            clinicId: this.clinicaId
          }
        )
      }

      let register = {
        doctorId: data.medico,
        items: this.listConsulta
      }

      if (this.atualizar == 0) {

        this.isActive = true;
        this.service.cadastrarPriceDoctor(register, (response => {
          this.isActive = false;
          this.toastrService.success('Registro cadastrado com sucesso !!!');
          this.limpaForm()
        }), (error) => {
          this.isActive = false;
          this.toastrService.danger(error.error.message);
        });

      } else {

        this.isActive = true;
        this.service.atualizarValor(register, (response => {
          this.isActive = false;
          this.toastrService.success('Registro atualizado com sucesso !!!');
          this.limpaForm()
        }), (error) => {
          this.isActive = false;
          this.toastrService.danger(error.error.message);
        });
      }

    }

  }

  limpaForm() {

    this.formParametrizarConsulta = this.formBuilder.group({
      valorPresencial: [null],
      valorEmergencial: [null],
      valorVideo: [null],
      valorCasa: [null],
      tempoPresencial: [null],
      tempoVideo: [null],
      tempoEmergencial: [null],
      tempoCasa: [null],
      medico: [null],
      qrCasa: [null],
      qrEmergencial: [null],
      qrVideo: [null],
      qrPresencial: [null],
      clinica: [null],
      optPresencial: [null],
      optVideo: [null],
      optEmergencial: [null],
      optCasa: [null],
    })

    var checkbox = document.querySelector("#presencial");
    if (checkbox.id == 'presencial') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }

    var checkbox = document.querySelector("#video");
    if (checkbox.id == 'video') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }

    var checkbox = document.querySelector("#emergencial");
    if (checkbox.id == 'emergencial') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }

    var checkbox = document.querySelector("#casa");
    if (checkbox.id == 'casa') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }

  }

  verificaValor(data) {

    this.isActive = true
    let params = new HttpParams();
    params = params.append('doctorId', data.medico)
    params = params.append('clinicId', data.clinica)

    this.service.buscaValor(params, (response) => {
      this.isActive = false;
      //this.atualizar = response;

      if (response.length == 0) {
        this.atualizar = 0;
        this.toastrService.warning('Configurar qual tipo de atendimento para o médico.');
      } else {

        this.atualizar = response;
        for (var i = 0; i < response.length; i++) {

          if (response[i].typeService.id == 1) {

            this.formParametrizarConsulta.controls['tempoPresencial'].setValue(response[i].duration);
            this.formParametrizarConsulta.controls['valorPresencial'].setValue(response[i].value);
            this.formParametrizarConsulta.controls['qrPresencial'].setValue(response[i].qrCode);

            var checkbox = document.querySelector("#presencial");
            function ativarCheckbox(el) {
              el.checked = true;
            }
            ativarCheckbox(checkbox);

          } else if (response[i].typeService.id == 2) {

            this.formParametrizarConsulta.controls['tempoVideo'].setValue(response[i].duration);
            this.formParametrizarConsulta.controls['valorVideo'].setValue(response[i].value);
            this.formParametrizarConsulta.controls['qrVideo'].setValue(response[i].qrCode);

            var checkbox = document.querySelector("#video");
            function ativarCheckbox(el) {
              el.checked = true;
            }
            ativarCheckbox(checkbox);

          } else if (response[i].typeService.id == 3) {

            this.formParametrizarConsulta.controls['tempoEmergencial'].setValue(response[i].duration);
            this.formParametrizarConsulta.controls['valorEmergencial'].setValue(response[i].value);
            this.formParametrizarConsulta.controls['qrEmergencial'].setValue(response[i].qrCode);

            var checkbox = document.querySelector("#emergencial");
            function ativarCheckbox(el) {
              el.checked = true;
            }
            ativarCheckbox(checkbox);

          } else if (response[i].typeService.id == 4) {

            this.formParametrizarConsulta.controls['tempoCasa'].setValue(response[i].duration);
            this.formParametrizarConsulta.controls['valorCasa'].setValue(response[i].value);
            this.formParametrizarConsulta.controls['qrCasa'].setValue(response[i].qrCode);

            var checkbox = document.querySelector("#casa");
            function ativarCheckbox(el) {
              el.checked = true;
            }
            ativarCheckbox(checkbox);
          }
        }

      }

    }, (error) => {
      this.isActive = false;
      if (error == undefined) {
        this.formParametrizarConsulta.controls['valorEmergencial'].setValue(null);
        this.formParametrizarConsulta.controls['tempoEmergencial'].setValue(null);
        this.formParametrizarConsulta.controls['qrEmergencial'].setValue(null);
        var checkbox = document.querySelector("#emergencial");
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }
      if (error == undefined) {
        this.formParametrizarConsulta.controls['valorVideo'].setValue(null);
        this.formParametrizarConsulta.controls['tempoVideo'].setValue(null);
        this.formParametrizarConsulta.controls['qrVideo'].setValue(null);
        var checkbox = document.querySelector("#video");
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }
      if (error == undefined) {
        this.formParametrizarConsulta.controls['tempoPresencial'].setValue(null);
        this.formParametrizarConsulta.controls['valorPresencial'].setValue(null);
        this.formParametrizarConsulta.controls['qrPresencial'].setValue(null);
        var checkbox = document.querySelector("#presencial");
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }
      if (error == undefined) {
        this.formParametrizarConsulta.controls['tempoCasa'].setValue(null);
        this.formParametrizarConsulta.controls['valorCasa'].setValue(null);
        this.formParametrizarConsulta.controls['qrCasa'].setValue(null);
        var checkbox = document.querySelector("#casa");
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }

    });

  }

  pesquisaClinica(data) {

    this.service.buscaClinica(data, null, (response) => {

      this.listClinica = response
      this.isActive = false

    }, (error) => {
      this.isActive = false;
      this.toastrService.danger(error.message);
    });

  }

  verificaClinica(data) {
    this.clinicaId = data;
  }

  buscarAtendimento(data) {
    this.verificaValor(data)
  }


}
