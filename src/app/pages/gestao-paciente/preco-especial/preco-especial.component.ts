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
  public isLoader: boolean = false;
  public checkValorVideo = null;
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
  public doctorId = null;
  public isUpdate = false;
  public atendimento = {
    name: null,
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
    this.atendimento.name = this.history.name;
    this.atendimento.id = this.history.id;
    this.listMedico = JSON.parse(localStorage.getItem('bway-medico'));

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

    this.clinic = localStorage.getItem('bway-domain'); 

    if(this.atendimento.name == null){

      this.router.navigate(['/pages/gestao-paciente/paciente']);

    }

    this.formPrecoEspecial = this.formBuilder.group({
      valorPresencial: [null],
      valorEmergencial: [null],
      valorVideo: [null],
      valorCasa: [null],
      medico: [''],
      clinica: [null],
      dataExpiracao: [null],
      valorVideoChamada: [null],
    })
   // this.formPrecoEspecial.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });

    //this.pesquisaClinica(this.listMedico[0].id)

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
      } else if (event == "5") {
        this.checkValorVideo = event
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
      } else if (event == "5") {
        this.checkValorVideo = null
      }

    }

  }

  salvar(data) {

    this.fetchData(true)

    if ((data.medico == null) || ((data.valorPresencial == null) && (data.valorEmergencial == null) &&
      (data.valorVideo == null) && (data.valorCasa == null) && (data.valorVideoChamada) && (data.clinica == null) && (this.atendimento.cpf == null))) {

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
      if (data.valorVideoChamada != null) {

        this.listConsulta.push(
          {
            expirationDate: data.dataExpiracao == null ? "2053-12-22" : data.dataExpiracao,
            typeServiceId: 5,
            value: data.valorVideoChamada,
          }
        )
      }

      let register = {
        doctorId: this.doctorId,
        clinicId: this.clinicaId,
        userId: this.atendimento.id,
        items: this.listConsulta
      }

      this.fetchData(true)

      if(this.isUpdate == true){

        this.toastrService.warning('Esta funcionalidade ainda não esta Disponível','Aditi Care!');

      }else{

      this.service.cadastrarPriceExclusive(register, (response => {
        this.fetchData(false)
        this.toastrService.success('Registro cadastrado com sucesso','Aditi Care!');
        this.limpaForm()
        this.previousPage()
      }), (error) => {
        this.fetchData(false)
        this.toastrService.danger(error.error.message);
      });
    }

    }
    this.fetchData(false)

  }

  limpaForm() {

    this.formPrecoEspecial = this.formBuilder.group({
      valorPresencial: [null],
      valorEmergencial: [null],
      valorVideo: [null],
      valorCasa: [null],
      medico: [null],
      clinica: [null],
      valorVideoChamada: [null]
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

    var checkbox = document.querySelector("#videoChamada");
    if (checkbox.id == 'videoChamada') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }

  }

  verificaValor(data) {

    this.doctorId = data;

    this.pesquisaClinica(data)
  }

  

  validaCampo(data) {

    if (data == null) {
      this.toastrService.danger('O campo médico é obrigatório!!!');
      return false
    }

    if (this.atendimento.cpf == null) {
      this.toastrService.danger('O campo Paciente é obrigatório!!!');
      return false
    }

    if (this.clinicaId == null) {
      this.toastrService.danger('O campo clínica é obrigatório!!!');
      return false
    }

    return true
  }

  pesquisaClinica(data) {

    this.fetchData(true)


    this.service.buscaClinica(data, null, (response) => {

      this.listClinica = response
      this.fetchData(false)

    }, (error) => {
      this.fetchData(false)
      this.toastrService.danger(error.error.message);
    });

  }

  verificaClinica(data) {
    this.clinicaId = data;
  }

  formatacpf(cpf: string): string {
    return cpf.replace(/[.-]/g, '');
}


fetchData(data) {
  if(data){
  // Mostra o loader
  this.isLoader =true
  }else{
    setTimeout(() => {
      // Oculta o loader após o atraso
      this.isLoader =false
  }, 2000);
}
}

  buscarAtendimento(data) {
    this.isBloqueio = true

    let params = new HttpParams();

  //params = params.append('federalId', this.atendimento.cpf);
  params = params.append('doctorId', this.doctorId);
  params = params.append('clinicId', this.clinicaId);
  params = params.append('federalId', this.formatacpf(this.atendimento.cpf));

if (this.validaCampo(this.doctorId)) {
  this.service.buscaValor(params, (response) => {

    if (response.length == 0) {
      this.atualizar = 0;
    } else {

      this.isUpdate = true;

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

        } else if (response[i].typeService.id == 5) {

          this.formPrecoEspecial.controls['valorVideoChamada'].setValue(response[i].value);

          var checkbox = document.querySelector("#videoChamada");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);

        }

      }

    }

  }, (error) => {
    this.fetchData(false)
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
    if (error == undefined) {
      this.formPrecoEspecial.controls['valorVideoChamada'].setValue(null);
      var checkbox = document.querySelector("#videoChamada");
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }

  });
} else {
  this.fetchData(false)
}
}


  previousPage() {
    this.router.navigate(['/pages/gestao-paciente/paciente'])
  }

}
