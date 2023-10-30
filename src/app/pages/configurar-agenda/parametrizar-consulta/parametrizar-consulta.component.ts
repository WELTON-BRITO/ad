/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder,Validators} from '@angular/forms';
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

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: ParametrizarConsultaService,
    private toastrService: NbToastrService) {
  }

  ngOnDestroy() { }
  ngOnInit() {

    this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));

    this.formParametrizarConsulta = this.formBuilder.group({
      valorPresencial: [null],
      valorEmergencial: [null],
      valorVideo: [null],
      tempoPresencial: [null],
      tempoVideo: [null],
      tempoEmergencial: [null],
      medico: [this.listMedico[0], Validators.required],
    })
    this.formParametrizarConsulta.controls['medico'].setValue(this.listMedico[0].id, {onlySelf: true}); // use the id of the first medico

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

    if ((data.medico == null) || ((data.valorPresencial == null) && (data.valorEmergencial == null) &&
      (data.valorVideo == null)) || ((data.tempoEmergencial == null) && (data.tempoPresencial == null) && (data.tempoVideo == null))) {

      this.toastrService.danger('Preencher os campos obrigatórios!!!');

    } else {

      if (this.atualizar == null) {

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
      tempoPresencial: [null],
      tempoVideo: [null],
      tempoEmergencial: [null],
      medico: [null],
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

  }

  verificaValor(data) {

    this.isActive = true
    let params = new HttpParams();
    params = params.append('doctorId', data)

    this.service.buscaValor(null, data, (response) => {
      this.isActive = false;
      this.atualizar = response;
      if (response.valueInPersonEmergency && response.durationEmergency != null) {

        this.formParametrizarConsulta.controls['valorEmergencial'].setValue(response.valueInPersonEmergency);
        this.formParametrizarConsulta.controls['tempoEmergencial'].setValue(response.durationEmergency);

        var checkbox = document.querySelector("#emergencial");
        function ativarCheckbox(el) {
          el.checked = true;
        }
        ativarCheckbox(checkbox);
      } else {

        this.formParametrizarConsulta.controls['valorEmergencial'].setValue(null);
        this.formParametrizarConsulta.controls['tempoEmergencial'].setValue(null);

        var checkbox = document.querySelector("#emergencial");
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);

      }

      if (response.valueRemote && response.durationRemote != null) {

        this.formParametrizarConsulta.controls['valorVideo'].setValue(response.valueRemote);
        this.formParametrizarConsulta.controls['tempoVideo'].setValue(response.durationRemote);
        var checkbox = document.querySelector("#video");
        function ativarCheckbox(el) {
          el.checked = true;
        }
        ativarCheckbox(checkbox);

      } else {

        this.formParametrizarConsulta.controls['valorVideo'].setValue(null);
        this.formParametrizarConsulta.controls['tempoVideo'].setValue(null);
        var checkbox = document.querySelector("#video");
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);

      }

      if (response.valueInPerson && response.durationInPerson != null) {

        this.formParametrizarConsulta.controls['tempoPresencial'].setValue(response.durationInPerson);
        this.formParametrizarConsulta.controls['valorPresencial'].setValue(response.valueInPerson);

        var checkbox = document.querySelector("#presencial");
        function ativarCheckbox(el) {
          el.checked = true;
        }
        ativarCheckbox(checkbox);

      } else {

        this.formParametrizarConsulta.controls['tempoPresencial'].setValue(null);
        this.formParametrizarConsulta.controls['valorPresencial'].setValue(null);

        var checkbox = document.querySelector("#presencial");
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);

      }

    }, (error) => {
      this.isActive = false;
      if (error == undefined) {
        this.formParametrizarConsulta.controls['valorEmergencial'].setValue(null);
        this.formParametrizarConsulta.controls['tempoEmergencial'].setValue(null);
        var checkbox = document.querySelector("#emergencial");
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }
      if (error == undefined) {
        this.formParametrizarConsulta.controls['valorVideo'].setValue(null);
        this.formParametrizarConsulta.controls['tempoVideo'].setValue(null);
        var checkbox = document.querySelector("#video");
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }
      if (error == undefined) {
        this.formParametrizarConsulta.controls['tempoPresencial'].setValue(null);
        this.formParametrizarConsulta.controls['valorPresencial'].setValue(null);
        var checkbox = document.querySelector("#presencial");
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }

    });

  }

}
