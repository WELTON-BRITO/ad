import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroMedicoService } from './cadastro-medico.service';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { Observable, Subscriber } from 'rxjs';
import { co } from '@fullcalendar/core/internal-common';
import { CPFValidator } from '../../shared/validators/CPFValidator';

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
  public isActive = false;
  public msgErro = 'CPF inválido!!!';
  public showMsgErro = false;
  public avatar = null;

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
      numeroEmpresa: [null],
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
    this.validaCampo(data)

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

    if ((data.nome != null) && (data.cpf != null) && (data.crm != null) && (data.dataNascimento != null) && (data.especialidade != null)
      && (this.sexo != false) && (data.telefoneCelular != null) && (data.bairro != null) && (data.rua != null)
      && (data.cep != null) && (data.numero != null) && (data.aceitoTermo != null)) {

      this.isActive = true;

      this.service.cadastrarMedico(register, (response => {

        this.isActive = false;
        this.toastrService.success('Cadastrado com sucesso !!!');
        this.isInfoGerais = false;
        this.isContato = false;
        this.limparForm();
        this.voltar();
      }), (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);
      });

    } else {
      this.toastrService.danger('Preencher os campos obrigatórios !!!');
    }
  }

  limparForm() {

    this.formCadastroMedico = this.formBuilder.group({
      cpf: [null],
      nome: [null],
      dataNascimento: [null],
      crm: [null],
      telefoneCelular: [null],
      numeroEmpresa: [null],
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

    this.avatar = null;

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
      this.avatar = 'data:application/pdf;base64,' + this.imagem;
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

  validaCampo(data) {

    if (data.nome == null) {
      this.toastrService.danger('O campo nome é obrigatório!!!');
    }
    if (data.cpf == null) {
      this.toastrService.danger('O campo cpf é obrigatório!!!');
    }
    if (data.crm == null) {
      this.toastrService.danger('O campo crm é obrigatório!!!');
    }
    if (data.dataNascimento == null) {
      this.toastrService.danger('O campo data de nascimento é obrigatório!!!');
    }
    if (data.especialidade == null) {
      this.toastrService.danger('O campo especialidade é obrigatório!!!');
    }
    if (this.sexo == false) {
      this.toastrService.danger('O campo sexo biologico é obrigatório!!!');
    }
    if (data.telefoneCelular == null) {
      this.toastrService.danger('O campo celular é obrigatório!!!');
    }
    if (data.bairro == null) {
      this.toastrService.danger('O campo bairro é obrigatório!!!');
    }
    if (data.rua == null) {
      this.toastrService.danger('O campo rua é obrigatório!!!');
    }
    if (data.cep == null) {
      this.toastrService.danger('O campo cep é obrigatório!!!');
    }
    if (data.numero == null) {
      this.toastrService.danger('O campo numéro é obrigatório!!!');
    }
    if (data.estado == null) {
      this.toastrService.danger('O campo estado é obrigatório!!!');
    }
    if (data.cidade == null) {
      this.toastrService.danger('O campo cidade é obrigatório!!!');
    }

  }

  isValidCpf(data) {

    if (!CPFValidator.isValidCPF(data.cpf)) {
      this.showMsgErro = true;
      return false;
    }
    this.showMsgErro = false;
    return true;
  }

  proximo() {

    this.isInfoGerais = false;
    this.isContato = true;

  }

  voltar() {
    this.router.navigate(['/login']);
  }

}
