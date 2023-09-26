import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroMedicoService } from './cadastro-medico.service';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { Observable, Subscriber } from 'rxjs';

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
  public listCidade = null;
  public listEspecialidade: Array<number> = [];
  public imagem = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: CadastroMedicoService,
    private toastrService: NbToastrService) {
  }
  ngOnDestroy() { }

  ngOnInit() {

    this.buscaEstado();
    this.buscaEspecialidade();
    this.formCadastroMedico = this.formBuilder.group({
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
      imgem: [null]
    });

  }

  viewdiv(data) {
    this.sexo = data;
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

      name: data.nome,
      password: data.senha,
      federalId: data.cpf,
      birthDate: data.dataNascimento,
      biologicalSex: this.sexo,
      crm: data.crm,
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
      specialties: data.especialidade,

    }

    this.service.cadastrarMedico(register, (response => {

      this.formCadastroMedico = this.formBuilder.group({
        cpf: [null],
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
        imgem: [null]
      });

      this.toastrService.success('Dr°' + response.name + 'cadastrado com sucesso !!!');
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

  buscaEspecialidade() {

    this.service.buscaSpecialty(null, (response) => {

      this.listEspecialidade = response

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

  toggle(checked: boolean) {
    this.checked = checked;
  }

  voltar() {
    this.router.navigate(['/login']);
  }

}
