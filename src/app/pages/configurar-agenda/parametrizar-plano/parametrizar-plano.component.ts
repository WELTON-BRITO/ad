/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  public isCardPlano = false;
  public isActive = false;
  public doctorId = false;
  public convenioId = null;
  public convenio = [];
  public plano = null;
  public isBtnPlano = false
  public optradio: string = 'N'; 


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: ParametrizarPlanoService,
    private toastrService: NbToastrService) { }

  ngOnDestroy() { }
  ngOnInit() {

    this.listMedico = JSON.parse(localStorage.getItem('bway-medico'));
    
    if (this.listMedico && this.listMedico.length > 0) {
      this.verificaMedico(this.listMedico[0].id);
    } else {
      console.error('A lista de médicos está vazia ou não definida!');
     this.toastrService.warning('Sua Sessão foi Encerrada, Efetue um Novo Login','Aditi Care');
    
    {
            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 3000); // 3000 milissegundos = 3 segundos
        }
    }    this.verificaConvenio(this.listMedico[0].id);

    this.formParametrizarPlano = this.formBuilder.group({
      medico: [this.listMedico[0], Validators.required],
      unimed: [null],
      bradescoSaude: [null],
      norteDame: [null],
      sulAmerica: [null],
      amil: [null],
      portoSeguro: [null],
      assimSaude: [null],
      hpVida: [null],
      preventSenior: [null],
      cemig: [null],
      cassi: [null],

    })
    this.formParametrizarPlano.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true }); // use the id of the first medico

  }
  

  funcValor(event, element) {

    if (element.checked == true) {
      if (event == "1") {
        this.formParametrizarPlano.controls['unimed'].setValue(event);
      } else if (event == "3") {
        this.formParametrizarPlano.controls['sulAmerica'].setValue(event);
      } else if (event == "4") {
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
      else if (event == "10") {
        this.formParametrizarPlano.controls['cemig'].setValue(event);
      }
      else if (event == "11") {
        this.formParametrizarPlano.controls['cassi'].setValue(event);
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
      else if (event == "10") {
        this.formParametrizarPlano.controls['cemig'].setValue(null);
      }
      else if (event == "11") {
        this.formParametrizarPlano.controls['cassi'].setValue(null);
      }

      this.removerConvenio(event)
    }

  }


  removerConvenio(event) {

    this.convenio.push(event);

  }

  salvar(data) {

    var checkbox_items = new Array(data.unimed, data.sulAmerica, data.norteDame, data.bradescoSaude,
      data.amil, data.portoSeguro, data.assimSaude, data.hpVida, data.preventSenior, data.cemig, data.cassi);

    function retornaConvenio(value) {
      return value;
    }

    var resultado = checkbox_items.filter(retornaConvenio);


    if (this.plano == "R") {

      this.isActive = true;
      this.service.removerConvenio(this.doctorId, this.convenio, (response => {
        this.isActive = false;
        this.toastrService.success('Registro Removido com Sucesso !!!','Aditi Care!');
        this.limpaForm()
      }), (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);
      });


    }

    if ((data.amil != null) || (data.assimSaude != null) || (data.bradescoSaude != null) || (data.hpVida != null)
      || (data.norteDame != null) || (data.portoSeguro != null) || (data.preventSenior != null)
      || (data.sulAmerica != null) || (data.unimed != null)|| (data.cemig != null)|| (data.cassi != null)) {

      let register = {

        healthPlans: resultado,
        doctorId: this.doctorId
      }

      this.isActive = true;
      this.service.cadastrarConvenio(register, (response => {
        this.isActive = false;
        this.toastrService.success('Registro cadastrado com sucesso !!!','Aditi Care!');
        // this.limpaForm()
      }), (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);
      });


    }

  }

  planoSaude(data) {

    this.optradio = data; // Atualiza o valor da variável com o valor selecionado

    if (data === 'S') {
      this.isCardPlano = true
      this.isBtnPlano = true
    } else {
      this.isCardPlano = false
      this.isBtnPlano = true
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
        cemig: [null],
        cassi: [null],
      })
      this.plano = 'R'
    }
  }


  verificaConvenio(data) {

    this.doctorId = data;
    this.isActive = true

    this.service.convenioAssociado(data, null, (response) => {

      if(response.length<=0){
        this.toastrService.warning('Este Médico Não Aceita Convenios','Aditi Care');
        this.planoSaude('N')
        this.isActive = false


      }else{

      this.isActive = false
      var checkbox = document.querySelector("#unimed");
      if (checkbox.id == 'unimed') {
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }
      var checkbox = document.querySelector("#bradescoSaude");
      if (checkbox.id == 'bradescoSaude') {
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }
      var checkbox = document.querySelector("#sulAmerica");
      if (checkbox.id == 'sulAmerica') {
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }
      var checkbox = document.querySelector("#norteDame");
      if (checkbox.id == 'norteDame') {
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }
      var checkbox = document.querySelector("#amil");
      if (checkbox.id == 'amil') {
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }
      var checkbox = document.querySelector("#portoSeguro");
      if (checkbox.id == 'portoSeguro') {
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }
      var checkbox = document.querySelector("#assimSaude");
      if (checkbox.id == 'assimSaude') {
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }
      var checkbox = document.querySelector("#hpVida");
      if (checkbox.id == 'hpVida') {
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }
      var checkbox = document.querySelector("#preventSenior");
      if (checkbox.id == 'preventSenior') {
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }
      var checkbox = document.querySelector("#cemig");
      if (checkbox.id == 'cemig') {
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }
      var checkbox = document.querySelector("#cassi");
      if (checkbox.id == 'cassi') {
        function ativarCheckbox(el) {
          el.checked = false;
        }
        ativarCheckbox(checkbox);
      }

      for (var i = 0; i < response.length; i++) {

        if (response[i].id == "1") {
          var checkbox = document.querySelector("#unimed");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['unimed'].setValue(response[i].id);
        }
        if (response[i].id == "2") {
          var checkbox = document.querySelector("#bradescoSaude");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['bradescoSaude'].setValue(response[i].id);
        }
        if (response[i].id == "3") {
          var checkbox = document.querySelector("#sulAmerica");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['sulAmerica'].setValue(response[i].id);
        }
        if (response[i].id == "4") {
          var checkbox = document.querySelector("#norteDame");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['norteDame'].setValue(response[i].id);
        }
        if (response[i].id == "5") {
          var checkbox = document.querySelector("#amil");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['amil'].setValue(response[i].id);
        }
        if (response[i].id == "6") {
          var checkbox = document.querySelector("#portoSeguro");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['portoSeguro'].setValue(response[i].id);
        }
        if (response[i].id == "7") {
          var checkbox = document.querySelector("#assimSaude");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['assimSaude'].setValue(response[i].id);
        }
        if (response[i].id == "8") {
          var checkbox = document.querySelector("#hpVida");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['hpVida'].setValue(response[i].id);
        }
        if (response[i].id == "9") {
          var checkbox = document.querySelector("#preventSenior");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['preventSenior'].setValue(response[i].id);
        }
        if (response[i].id == "10") {
          var checkbox = document.querySelector("#cemig");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['cemig'].setValue(response[i].id);
        }
        if (response[i].id == "11") {
          var checkbox = document.querySelector("#cassi");
          function ativarCheckbox(el) {
            el.checked = true;
          }
          ativarCheckbox(checkbox);
          this.formParametrizarPlano.controls['cassi'].setValue(response[i].id);
        }

      }
    }

    }, (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);
    });


  }

  limpaForm() {

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
      cemig: [null],
      cassi: [null],
    })

    var checkbox = document.querySelector("#unimed");
    if (checkbox.id == 'unimed') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }
    var checkbox = document.querySelector("#bradescoSaude");
    if (checkbox.id == 'bradescoSaude') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }
    var checkbox = document.querySelector("#sulAmerica");
    if (checkbox.id == 'sulAmerica') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }
    var checkbox = document.querySelector("#norteDame");
    if (checkbox.id == 'norteDame') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }
    var checkbox = document.querySelector("#amil");
    if (checkbox.id == 'amil') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }
    var checkbox = document.querySelector("#portoSeguro");
    if (checkbox.id == 'portoSeguro') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }
    var checkbox = document.querySelector("#assimSaude");
    if (checkbox.id == 'assimSaude') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }
    var checkbox = document.querySelector("#hpVida");
    if (checkbox.id == 'hpVida') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }
    var checkbox = document.querySelector("#preventSenior");
    if (checkbox.id == 'preventSenior') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }
    var checkbox = document.querySelector("#cemig");
    if (checkbox.id == 'cemig') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }
    var checkbox = document.querySelector("#cassi");
    if (checkbox.id == 'cassi') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }

    var checkbox = document.querySelector("#radio");
    if (checkbox.id == 'radio') {
      function ativarCheckbox(el) {
        el.checked = false;
      }
      ativarCheckbox(checkbox);
    }

  }

  verificaMedico(data) {
    this.doctorId = data
  }

}
