import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ParametrizarConsultaService } from './parametrizar-consulta.service';
import { NbToastrService } from '@nebular/theme';
import { HttpParams } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'ngx-parametrizar-consulta',
  styleUrls: ['./parametrizar-consulta.component.scss'],
  templateUrl: './parametrizar-consulta.component.html',
})
export class ParametrizarConsultaComponent implements OnDestroy {

  public formParametrizarConsulta = null;
  public listMedico = null;
  public isActive = false;
  public durationAtHome = null;
  public durationEmergency = null;
  public durationInPerson = null;
  public durationRemote = null;
  public valueAtHome = null;
  public valueInPerson = null;
  public valueInPersonEmergency = null;
  public valueRemote = null;
  public atualizar = null;
  public listClinica = null;
  public clinicaId = null;
  public listConsulta = [];
  public modalidade = [];
  public isBloqueio = true;
  public clinic = null;
  public ismodalidadeConsulta = false;
  public radioValuePresencial: boolean;
  public radioValueVideo: boolean;
  public radioValueEmergencial: boolean;
  public radioValueCasa: boolean;
  public radioValueChamada: boolean;
  public isLoader: boolean = false;
  public id_medico: null;


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: ParametrizarConsultaService,
    private toastrService: NbToastrService) {
  }

  ngOnDestroy() { }
  ngOnInit() {

    this.listMedico = JSON.parse(localStorage.getItem('bway-medico'));
    this.listClinica = JSON.parse(localStorage.getItem('bway-clinica'));
    this.clinic = localStorage.getItem('bway-domain');

    if (this.listMedico && this.listMedico.length > 0) {
    } else {
      console.error('A lista de médicos está vazia ou não definida!');
     this.toastrService.warning('Sua Sessão foi Encerrada, Efetue um Novo Login','Aditi Care');
    
    {
            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 3000); // 3000 milissegundos = 3 segundos
        }
    }

    if (this.clinic == 'CLINIC') {
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
      clinica: [this.listClinica[0], Validators.required],
      optPresencial: [null],
      optVideo: [null],
      optEmergencial: [null],
      optCasa: [null],
      videoChamada: [null],
      tempoVideoChamada: [null],
      qrVideoChamada: [null],
      optVideoChamada: [null],
      valorVideoChamada: [null],
      checkPresencial: [null]
    })
    this.formParametrizarConsulta.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });
    this.formParametrizarConsulta.controls['clinica'].setValue(this.listClinica[0].id, { onlySelf: true });
    this.clinicaId = this.listClinica[0].id;
    this.id_medico = this.listMedico[0].id;

  }

  fetchData(data) {
    if (data) {
      // Mostra o loader
      this.isLoader = true
    } else {
      setTimeout(() => {
        // Oculta o loader após o atraso
        this.isLoader = false
      }, 2000);
    }
  }

  salvar(data) {

    if ((data.tempoPresencial == null && data.tempoCasa == null &&
      data.tempoEmergencial == null && data.tempoVideo == null &&
      data.tempoVideoChamada == null) ||
      (data.valorCasa == null && data.valorEmergencial == null &&
        data.valorPresencial == null && data.valorVideo == null &&
        data.valorVideoChamada == null) ||
      (data.qrCasa == null && data.qrEmergencial == null &&
        data.qrPresencial == null && data.qrVideo == null &&
        data.qrVideoChamada == null)) {

      this.toastrService.danger('Favor Preencher os Campos Obrigatórios', 'Aditi Care');

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

      if (data.tempoVideoChamada != null) {

        this.listConsulta.push(
          {
            typeServiceId: 5,
            duration: data.tempoVideoChamada,
            value: data.valorVideoChamada,
            qrCode: data.qrVideoChamada,
            qrCodeBlocked: data.optVideoChamada == null ? true : data.optVideoChamada,
            clinicId: this.clinicaId
          }
        )
      }

      let register = {
        doctorId: data.medico,
        items: this.listConsulta
      }

      this.fetchData(true)

      if (this.atualizar == 0) {

        this.isActive = true;
        this.service.cadastrarPriceDoctor(register, (response => {
          this.isActive = false;
          this.toastrService.success('Registro Cadastrado com Sucesso', 'Aditi Care');
          this.fetchData(false)
          this.limpaForm()
        }), (error) => {
          this.isActive = false;
          this.toastrService.danger(error.error.message);
          this.fetchData(false)

        });

      } else {

        this.isActive = true;
        this.service.atualizarValor(register, (response => {
          this.isActive = false;
          this.toastrService.success('Registro Atualizado com Sucesso', 'Aditi Care');
          this.fetchData(false)
          this.limpaForm()
        }), (error) => {
          this.isActive = false;
          this.toastrService.danger(error.error.message);
          this.fetchData(false)
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
      medico: [this.id_medico, Validators.required],
      qrCasa: [null],
      qrEmergencial: [null],
      qrVideo: [null],
      qrPresencial: [null],
      clinica: [this.clinicaId, Validators.required],
      optPresencial: [null],
      optVideo: [null],
      optEmergencial: [null],
      optCasa: [null],
      videoChamada: [null],
      tempoVideoChamada: [null],
      qrVideoChamada: [null],
      optVideoChamada: [null],
      valorVideoChamada: [null]
    })

  }

  verificaValor() {

    this.limpaForm()

    this.isActive = true
    let params = new HttpParams();
    params = params.append('doctorId', this.id_medico)
    params = params.append('clinicId', this.clinicaId)

    this.fetchData(true)

    this.service.buscaValor(params, (response) => {
      this.isActive = false;

      if (response.length == 0) {

        this.atualizar = 0;
        document.getElementById('qrPresencial').removeAttribute('disabled');
        document.getElementById('qrVideo').removeAttribute('disabled');
        document.getElementById('qrEmergencial').removeAttribute('disabled');
        document.getElementById('qrCasa').removeAttribute('disabled');
        document.getElementById('qrVideoChamada').removeAttribute('disabled');

      } else {

        this.atualizar = response;
        for (var i = 0; i < response.length; i++) {

          if (response[i].typeService.id == 1) {
            this.formParametrizarConsulta.controls['tempoPresencial'].setValue(response[i].duration);
            this.formParametrizarConsulta.controls['valorPresencial'].setValue(response[i].value);
            this.formParametrizarConsulta.controls['qrPresencial'].setValue(response[i].qrCode);
            this.radioValuePresencial = response[i].qrCodeBlocked;

          } else {
            document.getElementById('qrPresencial').removeAttribute('disabled');
          }

          if (response[i].typeService.id == 2) {

            this.formParametrizarConsulta.controls['tempoVideo'].setValue(response[i].duration);
            this.formParametrizarConsulta.controls['valorVideo'].setValue(response[i].value);
            this.formParametrizarConsulta.controls['qrVideo'].setValue(response[i].qrCode);
            this.radioValueVideo = response[i].qrCodeBlocked;

          } else {
            document.getElementById('qrVideo').removeAttribute('disabled');
          }

          if (response[i].typeService.id == 3) {

            this.formParametrizarConsulta.controls['tempoEmergencial'].setValue(response[i].duration);
            this.formParametrizarConsulta.controls['valorEmergencial'].setValue(response[i].value);
            this.formParametrizarConsulta.controls['qrEmergencial'].setValue(response[i].qrCode);
            this.radioValueEmergencial = response[i].qrCodeBlocked;

          } else {
            document.getElementById('qrEmergencial').removeAttribute('disabled');
          }

          if (response[i].typeService.id == 4) {

            this.formParametrizarConsulta.controls['tempoCasa'].setValue(response[i].duration);
            this.formParametrizarConsulta.controls['valorCasa'].setValue(response[i].value);
            this.formParametrizarConsulta.controls['qrCasa'].setValue(response[i].qrCode);
            this.radioValueCasa = response[i].qrCodeBlocked;

          } else {
            document.getElementById('qrCasa').removeAttribute('disabled');
          }

          if (response[i].typeService.id == 5) {

            this.formParametrizarConsulta.controls['tempoVideoChamada'].setValue(response[i].duration);
            this.formParametrizarConsulta.controls['valorVideoChamada'].setValue(response[i].value);
            this.formParametrizarConsulta.controls['qrVideoChamada'].setValue(response[i].qrCode);
            this.radioValueChamada = response[i].qrCodeBlocked;

          } else {

            document.getElementById('qrVideoChamada').removeAttribute('disabled');

          }

          if (this.clinic == 'CLINIC') {
            document.getElementById('qrPresencial').removeAttribute('disabled');
            document.getElementById('qrVideo').removeAttribute('disabled');
            document.getElementById('qrEmergencial').removeAttribute('disabled');
            document.getElementById('qrCasa').removeAttribute('disabled');

          } else {
            if (response[i].qrCodeBlocked == false && response[i].typeService.id == 1) {
              document.getElementById('qrPresencial').removeAttribute('disabled');
            }
            if (response[i].qrCodeBlocked == false && response[i].typeService.id == 2) {
              document.getElementById('qrVideo').removeAttribute('disabled');
            }
            if (response[i].qrCodeBlocked == false && response[i].typeService.id == 3) {
              document.getElementById('qrEmergencial').removeAttribute('disabled');
            }
            if (response[i].qrCodeBlocked == false && response[i].typeService.id == 4) {
              document.getElementById('qrCasa').removeAttribute('disabled');
            }
            if (response[i].qrCodeBlocked == false && response[i].typeService.id == 5) {
              document.getElementById('qrVideoChamada').removeAttribute('disabled');
            }
          }

        }

      }

      this.fetchData(false)


    }, (error) => {
      this.isActive = false;
      this.fetchData(false)

      if (error == undefined) {
        this.formParametrizarConsulta.controls['valorEmergencial'].setValue(null);
        this.formParametrizarConsulta.controls['tempoEmergencial'].setValue(null);
        this.formParametrizarConsulta.controls['qrEmergencial'].setValue(null);
        this.radioValueEmergencial = null;
      }
      if (error == undefined) {
        this.formParametrizarConsulta.controls['valorVideo'].setValue(null);
        this.formParametrizarConsulta.controls['tempoVideo'].setValue(null);
        this.formParametrizarConsulta.controls['qrVideo'].setValue(null);
        this.radioValueVideo = null;
      }
      if (error == undefined) {
        this.formParametrizarConsulta.controls['tempoPresencial'].setValue(null);
        this.formParametrizarConsulta.controls['valorPresencial'].setValue(null);
        this.formParametrizarConsulta.controls['qrPresencial'].setValue(null);
        this.radioValuePresencial = null
      }
      if (error == undefined) {
        this.formParametrizarConsulta.controls['tempoCasa'].setValue(null);
        this.formParametrizarConsulta.controls['valorCasa'].setValue(null);
        this.formParametrizarConsulta.controls['qrCasa'].setValue(null);
        this.radioValueCasa = null;
      }
      if (error == undefined) {
        this.formParametrizarConsulta.controls['tempoVideoChamada'].setValue(null);
        this.formParametrizarConsulta.controls['valorVideoChamada'].setValue(null);
        this.formParametrizarConsulta.controls['qrVideoChamada'].setValue(null);
        this.radioValueChamada = null;
      }
    });

  }

  verificaClinica(data) {
    this.clinicaId = data;
  }

  SelectedMedico(data) {
    this.id_medico = data;
  }

  SelectedClinica(data) {
    this.clinicaId = data;
  }

  buscarAtendimento(data) {

    if (data.clinica != null) {
      this.ismodalidadeConsulta = true;
      this.verificaValor()
    } else {
      this.toastrService.danger('Por Favor Informe a Clinica', 'Aditi Care');
    }

  }
}
