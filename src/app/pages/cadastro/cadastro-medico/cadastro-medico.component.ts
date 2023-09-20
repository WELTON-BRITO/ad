import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroMedicoService } from './cadastro-medico.service';

@Component({
  selector: 'ngx-cadastro-medico',
  styleUrls: ['./cadastro-medico.component.scss'],
  templateUrl: './cadastro-medico.component.html',
})

export class CadastroMedicoComponent implements OnInit {

  public formCadastroMedico = null;
  public isInfoGerais = true;
  public isContato = false;
  checked = false;
  public sexo = false;
  public listEstado = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: CadastroMedicoService) { }
  ngOnDestroy() { }

  ngOnInit() {

    this.buscaEstado();

    this.formCadastroMedico = this.formBuilder.group({
      cnpj: [null, Validators.required],
      cpf: [null, Validators.required],
      nome: [null],
      dataNascimento: [null],
      crm: [null],
      telefoneCelular: [null],
      telefoneRecado: [null],
      email: [null],
      confirmaEmail: [null],
      aceitoTermo: [null],
      confirmaSenha: [null],
      senha: [null],
      estado: [null],
      cidade: [null],
      especialidade: [null],
      cep: [null],
      rua: [null],
      bairro: [null],
      numero: [null],
      complemento: [null],
    });

  }

  viewdiv(data) {
    console.log(data)
    this.sexo = data;
  }

  dadosPessoais(data) {
    console.log(data)
    if (data === 'informacao') {
      this.isInfoGerais = true;
      this.isContato = false;
    } else {
      this.isInfoGerais = false;
      this.isContato = true;
    }
  }

  cadastro(data) {

    let register = {

      name: data.nome,
      password: data.senha,
      federalId: data.cpf,
      birthDate: data.dataNascimento,
      biologicalSex: this.sexo,
      crm: data.crm,
      avatar: '',
      email: data.email,
      cellPhone: data.telefoneCelular,
      cityId: data.cidade,
      ufId: data.estado,
      zipCode: data.cep,
      street: data.rua,
      neighborhood: data.bairro,
      number: data.numero,
      complement: data.complemento,
      specialtyId: data.especialidade,

    }

    console.log(register)

    this.service.cadastrarMedico(register, (response => {
      console.log('entrei aqui')
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

  toggle(checked: boolean) {
    this.checked = checked;
  }

  voltar() {
    this.router.navigate(['/login']);
  }
}
