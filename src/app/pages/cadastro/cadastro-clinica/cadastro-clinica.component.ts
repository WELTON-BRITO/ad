import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroClinicaService } from './cadastro-clinica.service';
import { NbToastrService } from '@nebular/theme';
import { Observable, Subscriber } from 'rxjs';

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
  public listCidade = null;
  public imagem = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: CadastroClinicaService,
    private toastrService: NbToastrService) { }

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
      imgem: [null]
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

  cadastro(data) {

    this.verificarPassWord(data)
    this.verificarEmail(data)

    let register = {

      name: null,
      socialName: data.nomeEmpresa,
      responsibleFederalId: data.cnpj,
      responsibleName: data.nomeResponsavel,
      password: data.senha,
      federalId: data.cpf,
      avatar: this.imagem,
      email: data.email,
      cellPhone: data.telefoneCelular,
      cityId: data.cidade,
      ufId: data.estado,
      zipCode: data.cep,
      street: data.rua,
      neighborhood: data.bairro,
      number: data.numero,
      complement: data.complemento,

    }

    this.service.cadastrarClinica(register, (response => {

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
        imgem: [null]
      })

      this.toastrService.success(response.nomeEmpresa + 'cadastrado com sucesso !!!');
      this.isInfoGerais = true;
      this.isContato = false;
    }), error => {

      this.toastrService.danger(error.error.message);

    });
  }

  buscaEstado() {

    this.service.buscaEstado(null, (response) => {

      this.listEstado = response

    }, (error) => {
      this.toastrService.danger(error.error.message);
    });

  }

  buscaCidade(data) {

    this.service.buscaCidade(null, data, (response) => {

      this.listCidade = response

    }, (error) => {
      this.toastrService.danger(error.error.message);
    });
  }

  verificarPassWord(data) {
    if (data.senha != data.confirmaSenha) {
      this.toastrService.danger('Por gentileza verificar a senha, não confere!!!');
    }
  }

  verificarEmail(data) {

    if (data.email != data.confirmaEmail) {
      this.toastrService.danger('Por gentileza verificar o email, não confere!!!');
    }
  }

  public converterImagem = ($event: Event, element) => {

    const target = $event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.convertToBase64(file, element);
  }

  public convertToBase64(file: File, element) {

    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber)
    })

    observable.subscribe((d: String) => {

      this.imagem = d.slice(d.indexOf(",") + 1);

    })

  }

  public readFile(file: File, subscribe: Subscriber<any>) {
    const filereader = new FileReader();

    filereader.readAsDataURL(file)
    filereader.onload = () => {
      subscribe.next(filereader.result);
      subscribe.complete()
    }
    filereader.onerror = () => {
      subscribe.error()
      subscribe.complete()
    }
  }

  voltar() {
    this.router.navigate(['/login']);
  }
}
