import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ParametrizarPlanoService } from './parametrizar-plano.service';
import { NbToastrService } from '@nebular/theme';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'ngx-parametrizar-plano',
  styleUrls: ['./parametrizar-plano.component.scss'],
  templateUrl: './parametrizar-plano.component.html',
})
export class ParametrizarPlanoComponent implements OnDestroy {

  public formParametrizarPlano = null;
  public listConvenio = null;
  public listMedico = null;
  public checkUnimed = null;
  public checkSulAmerica = null;
  public checkNorteDame = null;
  public checkBradescoSaude = null;
  public checkAmil = null;
  public checkPortoSeguro = null;
  public checkAssimSaude = null;
  public checkPreventSenior = null;
  public checkHpVida = null;
  public isCardPlano = true;
  public isActive = false;
  public doctorId = false;
  public teste: any[];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: ParametrizarPlanoService,
    private toastrService: NbToastrService) { }

  ngOnDestroy() { }
  ngOnInit() {

    var name = localStorage.getItem('bway-domain');
    var id = localStorage.getItem('bway-entityId');

    if (name == 'CLINIC') {
      this.pesquisaClinica(id)
    } else if (name == 'DOCTOR') {
      this.pesquisaMedico(id);
    };

    this.formParametrizarPlano = this.formBuilder.group({
      medico: [null],
      unimed: [null],
      bradescoSaude: [null],
      norteDame: [null],
      sulAmerica: [null],
      amil: [null],
      portoSeguro: [null],
      assimSaude: [null],
      hpVida: [null],
      preventSenior: [null],
    })

  }

  funcValor(event, element) {
  
    if (element.checked == true) {
      if (event == "1") {
        this.formParametrizarPlano.controls['unimed'].setValue(event);
      } else if (event == "3") {
        element.setValue = 3;
        this.formParametrizarPlano.controls['sulAmerica'].setValue(event);
      } else if (event == "4") {
        this.checkNorteDame = event
        this.formParametrizarPlano.controls['norteDame'].setValue(event);
      } else if (event == "2") {
        this.formParametrizarPlano.controls['bradescoSaude'].setValue(event);
      } else if (event == "5") {
        this.formParametrizarPlano.controls['amil'].setValue(event);
      } else if (event == "6") {
        this.formParametrizarPlano.controls['portoSeguro'].setValue(event);
      } else if (event == "7") {
        this.formParametrizarPlano.controls['assimSaude'].setValue(event);
      } else if (event == "9") {
        this.formParametrizarPlano.controls['preventSenior'].setValue(event);
      } else if (event == "8") {
        this.formParametrizarPlano.controls['hpVida'].setValue(event);
      }

    } else if (element.checked == false) {
      if (event == "1") {
        this.formParametrizarPlano.controls['unimed'].setValue(null);
      } else if (event == "3") {
        this.formParametrizarPlano.controls['sulAmerica'].setValue(null);
      } else if (event == "4") {
        this.formParametrizarPlano.controls['norteDame'].setValue(null);
      } else if (event == "2") {
        this.formParametrizarPlano.controls['bradescoSaude'].setValue(null);
      } else if (event == "5") {
        this.formParametrizarPlano.controls['amil'].setValue(null);
      } else if (event == "6") {
        this.formParametrizarPlano.controls['portoSeguro'].setValue(null);
      } else if (event == "7") {
        this.formParametrizarPlano.controls['assimSaude'].setValue(null);
      } else if (event == "9") {
        this.formParametrizarPlano.controls['preventSenior'].setValue(null);
      } else if (event == "8") {
        this.formParametrizarPlano.controls['hpVida'].setValue(null);
      }     
    }

  }

  pesquisaMedico(data) {

    this.isActive = true

    let params = new HttpParams();
    params = params.append('doctorId', data)

    this.service.buscaDoctor(params, (response) => {

      this.listMedico = response
      this.isActive = false

    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);
    });

  }

  pesquisaClinica(data) {
    this.isActive = true
    this.service.buscaClinica(data, null, (response) => {

      this.listMedico = response
      this.isActive = false

    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);
    });

  }

  salvar(data) {

    var checkbox_items = new Array(data.unimed, data.sulAmerica, data.norteDame, data.bradescoSaude,
      data.amil, data.portoSeguro, data.assimSaude, data.hpVida, data.preventSenior);

    function retornaConvenio(value) {
      return value;
    }
    var resultado = checkbox_items.filter(retornaConvenio);

    let register = {

      healthPlans: resultado,
      doctorId: this.doctorId
    }

    this.isActive = true;
    this.service.cadastrarConvenio(register, (response => {
      this.isActive = false;
      this.toastrService.success('Registro cadastrado com sucesso !!!');
      this.limpaForm()
    }), message => {
      this.isActive = false;
      this.toastrService.danger(message);
    });

  }

  planoSaude(data) {
   
    if (data === 'S') {   
      this.isCardPlano = true
    } else {    
      this.isCardPlano = false

      this.formParametrizarPlano = this.formBuilder.group({       
        unimed: [null],
        bradescoSaude: [null],
        norteDame: [null],
        sulAmerica: [null],
        amil: [null],
        portoSeguro: [null],
        assimSaude: [null],
        hpVida: [null],
        preventSenior: [null],
      })
    }
  }


  verificaConvenio(data) {

    this.doctorId = data;
    this.isActive = true

    this.service.convenioAssociado(data, null, (response) => {

      this.isActive = false

      for (var i = 0; i < response.length; i++) {

        if (response[i].id == "1") {
          var checkbox = document.querySelector("#unimed");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['unimed'].setValue(response[i].id);
        } else if (response[i].id == "2") {
          var checkbox = document.querySelector("#bradescoSaude");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['bradescoSaude'].setValue(response[i].id);
        } else if (response[i].id == "3") {
          var checkbox = document.querySelector("#sulAmerica");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['sulAmerica'].setValue(response[i].id);
        }  else if (response[i].id == "4") {
          var checkbox = document.querySelector("#norteDame");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['norteDame'].setValue(response[i].id);
        } else if (response[i].id == "5") {
          var checkbox = document.querySelector("#amil");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['amil'].setValue(response[i].id);
        } else if (response[i].id == "6") {
          var checkbox = document.querySelector("#portoSeguro");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['portoSeguro'].setValue(response[i].id);
        } else if (response[i].id == "7") {
          var checkbox = document.querySelector("#assimSaude");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['assimSaude'].setValue(response[i].id);
        } else if (response[i].id == "8") {
          var checkbox = document.querySelector("#hpVida");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['hpVida'].setValue(response[i].id);
        } else if (response[i].id == "9") {
          var checkbox = document.querySelector("#preventSenior");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['preventSenior'].setValue(response[i].id);
        }

      }

    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);
    });


  }

  limpaForm(){

    this.formParametrizarPlano = this.formBuilder.group({
      medico: [null],
      unimed: [null],
      bradescoSaude: [null],
      norteDame: [null],
      sulAmerica: [null],
      amil: [null],
      portoSeguro: [null],
      assimSaude: [null],
      hpVida: [null],
      preventSenior: [null],
    })
    var checkbox = document.querySelector("#unimed");
    var checkbox = document.querySelector("#bradescoSaude");
    var checkbox = document.querySelector("#sulAmerica");
    var checkbox = document.querySelector("#norteDame");
    var checkbox = document.querySelector("#amil");
    var checkbox = document.querySelector("#portoSeguro");
    var checkbox = document.querySelector("#assimSaude");
    var checkbox = document.querySelector("#hpVida");
    var checkbox = document.querySelector("#preventSenior");
    function ativarCheckbox(el) {
      el.checked = false;
    }
    ativarCheckbox(checkbox);

  }

}
