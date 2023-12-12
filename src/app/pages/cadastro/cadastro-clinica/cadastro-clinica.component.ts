import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroClinicaService } from './cadastro-clinica.service';
import { NbToastrService } from '@nebular/theme';
import { Observable, Subscriber } from 'rxjs';
import { CPFValidator } from '../../shared/validators/CPFValidator';
import { SearchZipCodeService } from '../../shared/services/searchZipCode.services';

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
  public isActive = false;
  public msgErro = 'CPF inválido!!!';
  public showMsgErro = false;
  public avatar = null;
  showPass = false;
  showPassw = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: CadastroClinicaService,
    private serviceCep: SearchZipCodeService,
    private toastrService: NbToastrService) { }

  ngOnDestroy() { }
  ngOnInit() {

    localStorage.setItem('Authorization', '1');
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
      numeroEmpresa: [null],
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
    this.validaCampo(data)

    let register = {

      name: data.nomeEmpresa,
      socialName: data.nomeEmpresa,
      responsibleFederalId: data.cpf,
      responsibleName: data.nomeResponsavel,
      password: data.senha,
      federalId: data.cnpj,
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

    if ((data.nomeEmpresa != null) && (data.cpf != null) && (data.nomeResponsavel != null) && (data.cnpj != null)
      && (data.telefoneCelular != null) && (data.bairro != null) && (data.rua != null) && (data.cep != null) && (data.numero != null)
      && (data.estado != null) && (data.cidade != null) && (data.aceitoTermo != null) && (this.showMsgErro === false)) {

      this.isActive = true;

      this.service.cadastrarClinica(register, (response => {

        this.isActive = false;
        this.toastrService.success('Cadastrado com sucesso !!!');
        this.isInfoGerais = true;
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
      numeroEmpresa: [null],
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
      imgem: [null],
    })

    this.avatar = null;

  }

  buscaEstado() {

    this.service.buscaEstado(null, (response) => {

      this.listEstado = response

    }, (error) => {
      this.toastrService.danger(error.error.message);
    });

  }

  buscaCep(data) {

    this.serviceCep.buscaCep(data.cep, null, (response) => {

      this.formCadastroClinica.controls['rua'].setValue(response.logradouro.replace('Rua', '').replace('Avenida', '').trim());
      this.formCadastroClinica.controls['bairro'].setValue(response.bairro.trim());

    }, (error) => {
      this.toastrService.danger(error.error.message);
    });
  }

  buscaCidade(data) {

    this.isActive = true;

    this.service.buscaCidade(null, data, (response) => {
      this.isActive = false;
      this.listCidade = response

    }, (error) => {
      this.isActive = false;
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
    filereader.onload = async () => {
      await this.resizeImage(filereader.result as string).then((resolve: any) => {
        subscribe.next(resolve);
        subscribe.complete()
      });
    };
    filereader.onerror = () => {
      subscribe.error()
      subscribe.complete()
    }
  }

  resizeImage(imageURL: any): Promise<any> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
          ctx.drawImage(image, 0, 0, 200, 200);
        }
        var data = canvas.toDataURL('image/jpeg', 1);
        resolve(data);
      };
      image.src = imageURL;
    });
  }

  validaCampo(data) {

    if (data.nomeEmpresa == null) {
      this.toastrService.danger('O campo nome da empresa é obrigatório!!!');
    }
    if (data.nomeResponsavel == null) {
      this.toastrService.danger('O campo nome responsáve é obrigatório!!!');
    }
    if (data.cnpj == null) {
      this.toastrService.danger('O campo cnpj é obrigatório!!!');
    }
    if (data.cpf == null) {
      this.toastrService.danger('O campo cpf é obrigatório!!!');
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

  proximo() {
    this.isInfoGerais = false;
    this.isContato = true;
  }

  isValidCpf(data) {

    if (!CPFValidator.isValidCPF(data.cpf)) {
      this.showMsgErro = true;
      return false;
    }
    this.showMsgErro = false;
    return true;
  }

  toggleShowPass() {
    this.showPass = !this.showPass;
  }

  toggleShow() {
    this.showPassw = !this.showPassw;
  }

  voltar() {
    this.router.navigate(['/login']);
  }
}
