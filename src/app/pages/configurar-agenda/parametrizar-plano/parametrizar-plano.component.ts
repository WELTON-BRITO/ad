import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private formBuilder: FormBuilder,
    private router: Router) {

      this.listConvenio = [
        {
          convenio: '1',
          descricao: 'Unimed'
        },
        {
          convenio: '2',
          descricao: 'Teste Vida'
        },
        {
          convenio: '3',
          descricao: 'Oni Teste'
        },
        {
          convenio: '4',
          descricao: 'Acabou'
        }
      ],
      
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

    this.formParametrizarPlano = this.formBuilder.group({      
      medico: [null],
    })

  }

  funcValor(event, element){

    if (element.checked == true) {
      if (event == "U") {
        this.checkUnimed = event;
      } else if (event == "SA") {
        this.checkSulAmerica = event;
      } else if (event == "ND") {
        this.checkNorteDame = event
      }else if (event == "BS") {
        this.checkBradescoSaude = event
      }else if (event == "A") {
        this.checkAmil = event
      }else if (event == "PSS") {
        this.checkPortoSeguro = event
      }else if (event == "AS") {
        this.checkAssimSaude = event
      }else if (event == "PS") {
        this.checkPreventSenior = event
      }else if (event == "HA") {
        this.checkHpVida = event
      }
      
    } else if (element.checked == false) {
      if (event == "U") {
        this.checkUnimed = null;
      } else if (event == "SA") {
        this.checkSulAmerica = null;
      } else if (event == "ND") {
        this.checkNorteDame = null
      }else if (event == "BS") {
        this.checkBradescoSaude = null
      }else if (event == "A") {
        this.checkAmil = null
      }else if (event == "PSS") {
        this.checkPortoSeguro = null
      }else if (event == "AS") {
        this.checkAssimSaude = null
      }else if (event == "PS") {
        this.checkPreventSenior = null
      }else if (event == "HA") {
        this.checkHpVida = null
      }

    }
  }

  salvar(data){
    console.log(data)
    console.log(this.checkUnimed)
    console.log(this.checkSulAmerica)
    console.log(this.checkNorteDame)
    console.log(this.checkBradescoSaude)
    console.log(this.checkAmil)
    console.log(this.checkPortoSeguro)
    console.log(this.checkAssimSaude)
    console.log(this.checkPreventSenior)
    console.log(this.checkHpVida)
  }

  planoSaude(data){
    console.log(data)

    if(data === 'S'){
      console.log('tem expediente')
      this.isCardPlano = true
    }else{
      console.log('não terá expediente')
      this.isCardPlano = false
    }
  }
 
}
