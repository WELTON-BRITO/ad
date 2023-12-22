import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { HttpParams } from '@angular/common/http';
import { PrecoEspecialService } from './preco.service';
import * as moment from 'moment';

@Component({
  selector: 'ngx-preco-especial',
  styleUrls: ['./preco-especial.component.scss'],
  templateUrl: './preco-especial.component.html',
})

export class PrecoEspecialComponent implements OnDestroy {

  public formPrecoEspecial = null;
  public listMedico = null;
  public checkPresencial = null;
  public checkVideo = null;
  public checkEmergencial = null;
  public checkCasa = null;
  public isActive = false;
  public checked = false;
  public atualizar = null;
  public listClinica = null;
  public clinicaId = null;
  public listConsulta = [];
  public modalidade = [];
  public clinic = null;
  public history = null;
  public isBloqueio = false;
  public atendimento = {
    id: null,
    cpf: null
  }

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: PrecoEspecialService,
    private toastrService: NbToastrService) {
  }

  ngOnDestroy() { }
  ngOnInit() {

    this.history = history.state;
    this.atendimento.cpf = this.history.federalId;
    this.atendimento.id = this.history.id;
    this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));
    this.clinic = localStorage.getItem('bway-domain');

    this.formPrecoEspecial = this.formBuilder.group({
      valorPresencial: [null],
      valorEmergencial: [null],
      valorVideo: [null],
      valorCasa: [null],
      medico: [this.listMedico[0], Validators.required],
      clinica: [null],
      dataExpiracao: [null]
    })
    this.formPrecoEspecial.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });

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
      (data.valorVideo == null) && (data.valorCasa == null) && (data.clinica == null) && (this.atendimento.cpf == null))) {

      this.toastrService.danger('Preencher os campos obrigatórios!!!');

    } else {

      if (data.valorPresencial != null) {

        this.listConsulta.push(
          {
            expirationDate: data.dataExpiracao == null ? "2053-12-22" : data.dataExpiracao,
            typeServiceId: 1,
            value: data.valorPresencial,
          }
        )
      }
      if (data.valorVideo != null) {

        this.listConsulta.push(
          {
            expirationDate: data.dataExpiracao == null ? "2053-12-22" : data.dataExpiracao,
            typeServiceId: 2,
            value: data.valorVideo,
          }
        )
      }
      if (data.valorEmergencial != null) {

        this.listConsulta.push(
          {
            expirationDate: data.dataExpiracao == null ? "2053-12-22" : data.dataExpiracao,
            typeServiceId: 3,
            value: data.valorEmergencial,
          }
        )
      }
      if (data.valorCasa != null) {

        this.listConsulta.push(
          {
            expirationDate: data.dataExpiracao == null ? "2053-12-22" : data.dataExpiracao,
            typeServiceId: 4,
            value: data.valorCasa,
          }
        )
      }

      let register = {
        doctorId: data.medico,
        clinicId: data.clinica,
        userId: this.atendimento.id,
        items: this.listConsulta
      }

      this.isActive = true;
      this.service.cadastrarPriceExclusive(register, (response => {
        this.isActive = false;
        this.toastrService.success('Registro cadastrado com sucesso !!!');
        this.limpaForm()
        this.previousPage()
      }), (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);
      });

    }

  }

  limpaForm() {

    this.formPrecoEspecial = this.formBuilder.group({
      valorPresencial: [null],
      valorEmergencial: [null],
      valorVideo: [null],
      valorCasa: [null],
      medico: [null],
      clinica: [null],
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

    let params = new HttpParams();

    params = params.append('federalId', this.atendimento.cpf);
    params = params.append('doctorId', data.medico);
    params = params.append('clinicId', data.clinica);
    this.isActive = true
    if (this.validaCampo(data)) {
      this.service.buscaValor(params, (response) => {
        this.isActive = false;

        if (response.length == 0) {
          this.atualizar = 0;
          this.toastrService.warning('Configurar qual tipo de atendimento para o médico.');
        } else {

          this.atualizar = response;

          let dataExpiracao = moment(response[0].expirationDate).format('YYYY-MM-DD')

          this.formPrecoEspecial.controls['dataExpiracao'].setValue(dataExpiracao);

          for (var i = 0; i < response.length; i++) {

            if (response[i].typeService.id == 1) {

              this.formPrecoEspecial.controls['valorPresencial'].setValue(response[i].value);

              var checkbox = document.querySelector("#presencial");
              function ativarCheckbox(el) {
                el.checked = true;
              }
              ativarCheckbox(checkbox);

            } else if (response[i].typeService.id == 2) {

              this.formPrecoEspecial.controls['valorVideo'].setValue(response[i].value);

              var checkbox = document.querySelector("#video");
              function ativarCheckbox(el) {
                el.checked = true;
              }
              ativarCheckbox(checkbox);

            } else if (response[i].typeService.id == 3) {

              this.formPrecoEspecial.controls['valorEmergencial'].setValue(response[i].value);

              var checkbox = document.querySelector("#emergencial");
              function ativarCheckbox(el) {
                el.checked = true;
              }
              ativarCheckbox(checkbox);

            } else if (response[i].typeService.id == 4) {

              this.formPrecoEspecial.controls['valorCasa'].setValue(response[i].value);

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

          this.formPrecoEspecial.controls['valorEmergencial'].setValue(null);

          var checkbox = document.querySelector("#emergencial");
          function ativarCheckbox(el) {
            el.checked = false;
          }
          ativarCheckbox(checkbox);
        }
        if (error == undefined) {
          this.formPrecoEspecial.controls['valorVideo'].setValue(null);
          var checkbox = document.querySelector("#video");
          function ativarCheckbox(el) {
            el.checked = false;
          }
          ativarCheckbox(checkbox);
        }
        if (error == undefined) {
          this.formPrecoEspecial.controls['valorPresencial'].setValue(null);
          var checkbox = document.querySelector("#presencial");
          function ativarCheckbox(el) {
            el.checked = false;
          }
          ativarCheckbox(checkbox);
        }
        if (error == undefined) {
          this.formPrecoEspecial.controls['valorCasa'].setValue(null);
          var checkbox = document.querySelector("#casa");
          function ativarCheckbox(el) {
            el.checked = false;
          }
          ativarCheckbox(checkbox);
        }

      });
    } else {
      this.isActive = false
    }
  }

  validaCampo(data) {

    if (data.medico == null) {
      this.toastrService.danger('O campo médico é obrigatório!!!');
      return false
    }
    if (this.atendimento.cpf == null) {
      this.toastrService.danger('O campo cpf é obrigatório!!!');
      return false
    }
    if (data.clinica == null) {
      this.toastrService.danger('O campo clínica é obrigatório!!!');
      return false
    }

    return true
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
    this.isBloqueio = true
    this.verificaValor(data)

  }

  previousPage() {
    this.router.navigate(['/pages/gestao-paciente/paciente'])
  }

}
