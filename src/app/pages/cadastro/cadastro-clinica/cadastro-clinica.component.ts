import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroClinicaService } from './cadastro-clinica.service';

@Component({
  selector: 'ngx-cadastro-clinica',
  styleUrls: ['./cadastro-clinica.component.scss'],
  templateUrl: './cadastro-clinica.component.html',
})
export class CadastroClinicaComponent implements OnDestroy {

  public formCadastroClinica = null;
  public isInfoGerais = true;
  public isContato = false;
  public listEstado = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: CadastroClinicaService) { }

  ngOnDestroy() { }
  ngOnInit() {

    this.buscaEstado();
    this.formCadastroClinica = this.formBuilder.group({
      nomeEmpresa: [null],
      nomeResponsavel: [null],
      cnpj: [null],
      cpf: [null],
      telefoneCelular: [null],
      email: [null],
      senha: [null],
      aceitoTermo: [null],
      crm: [null],
      telefoneRecado: [null],
      confirmaEmail: [null],
      confirmaSenha: [null],
      estado: [null],
      cidade: [null],
      especialidade: [null],
      cep: [null],
      rua: [null],
      bairro: [null],
      numero: [null],
      complemento: [null],
    })

  } 

  dadosPessoais(data) {
    if (data === 'informacao') {
      this.isInfoGerais = true;
      this.isContato = false;
    } else {
      this.isInfoGerais = false;
      this.isContato = true;
    }
  }

  cadastro(data){
    let register = {  
        
      name: data, 
      socialName: data, 
      responsibleFederalId: data,
      responsibleName: data,
      password: data,
      federalId: data,
      avatar: data,
      email: data,
      cellPhone: data,
      cityId: data,
      ufId: data,
      zipCode: data,
      street: data,
      neighborhood: data, 
      number: data,
      complement: data,      

  }

  console.log(register)

  this.service.cadastrarClinica(register, (response => {
     console.log(response)
  }), error => {

    console.log(error)

  });
  }

  buscaEstado() {

    this.service.buscaEstado(null, (response) => {

      this.listEstado = response

    }, (error) => {
      console.log(error)
      //this.notifications.error(error.message);
      //this.limparForm();
    });

  }

  voltar() {
    this.router.navigate(['/pages/dashboard']);
  }
}
