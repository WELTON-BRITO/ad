import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroMedicoService } from './cadastro-medico.service';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { Observable, Subscriber } from 'rxjs';
import { co } from '@fullcalendar/core/internal-common';
import { CPFValidator } from '../../shared/validators/CPFValidator';
import { SearchZipCodeService } from '../../shared/services/searchZipCode.services';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'ngx-cadastro-medico',
  styleUrls: ['./cadastro-medico.component.scss'],
  templateUrl: './cadastro-medico.component.html',
})

export class CadastroMedicoComponent implements OnInit {

  public formCadastroMedico = null;
  public isInfoGerais = true;
  public isContato = false;
  public isClinica = false;
  checked = false;
  public sexo = false;
  public listEstado = null;
  public listCidade = null;
  public listEspecialidade: Array<number> = [];
  public imagem = null;
  public isActive = false;
  public msgErro = 'CPF inválido!!!';
  public showMsgErro = false;
  public showMsgErroClinica = false;
  public avatar = null;
  public rowData = [];
  showPass = false;
  showPassw = false;
  public title = 'Por favor insira os seus dados para darmos inicio ao seu cadastro.';
  public titleClinica = 'Por favor informe a baixo todas as clinicas em que você trabalha para que possa gerenciar os seus horários de atendimento em cada uma delas. Ao informar os dados clique no botão adicionar, caso trabalhe em mais de uma, repita o processo até informar todas as que desejar.'

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: CadastroMedicoService,
    private serviceCep: SearchZipCodeService,
    private toastrService: NbToastrService) {
  }
  ngOnDestroy() { }

  ngOnInit() {

    localStorage.setItem('Authorization', '1');
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
      imgem: [null],
      name: [null],
      socialName: [null],
      federalId: [null],
      ufId: [null],
      cityId: [this.listCidade],
      numeroClinica: [null],
      neighborhood: [null],
      street: [null],
      zipCode: [null],
      complementoClinica: [null],
      cellPhone: [null]
    });

  }

  viewdiv(data) {
    this.sexo = data;
  }

  dadosPessoais(data) {

    if (data === 'informacao') {
      this.isInfoGerais = true;
      this.isContato = false;
      this.isClinica = false;
    } else if (data === 'contato') {
      this.isInfoGerais = false;
      this.isContato = true;
      this.isClinica = false;
    } else if (data === 'clinica') {
      this.isClinica = true;
      this.isInfoGerais = false;
      this.isContato = false;
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
      cityId: data.cityId,
      ufId: data.ufId,
      zipCode: data.zipCode,
      street: data.street,
      neighborhood: data.neighborhood,
      number: data.numeroClinica,
      complement: data.complementoClinica,
      specialties: data.especialidade,
      clinics: this.rowData

    }

    if ((data.nome != null) && (data.cpf != null) && (data.crm != null) && (data.dataNascimento != null) && (data.especialidade != null)
      && (this.sexo != false) && (data.telefoneCelular != null) && (data.aceitoTermo != null) && (data.ufId != null) && (data.cityId != null)
      && (data.zipCode != null) && (data.street != null) && (data.neighborhood != null) && (data.numeroClinica != null) && (this.showMsgErro === false)) {

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
      imgem: [null],
      name: [null],
      socialName: [null],
      federalId: [null],
      ufId: [null],
      cityId: [null],
      numeroClinica: [null],
      neighborhood: [null],
      street: [null],
      zipCode: [null],
      complementoClinica: [null],
      cellPhone: [null]
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

  buscaCep(data, element) {

    if (data.cep != null) {
      var cepId = data.cep
    } else if (data.zipCode != null) {
      var cepId = data.zipCode;
    }


    this.serviceCep.buscaCep(cepId, null, (response) => {

      if (element == 'cep') {
        this.formCadastroMedico.controls['rua'].setValue(response.logradouro.replace('Rua', '').replace('Avenida', '').trim());
        this.formCadastroMedico.controls['bairro'].setValue(response.bairro.trim());
      }
      if (element == 'zipCode') {
        this.formCadastroMedico.controls['street'].setValue(response.logradouro.replace('Rua', '').replace('Avenida', '').trim());
        this.formCadastroMedico.controls['neighborhood'].setValue(response.bairro.trim());
      }


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
    if (data.neighborhood == null) {
      this.toastrService.danger('O campo bairro é obrigatório!!!');
    }
    if (data.street == null) {
      this.toastrService.danger('O campo rua é obrigatório!!!');
    }
    if (data.zipCode == null) {
      this.toastrService.danger('O campo cep é obrigatório!!!');
    }
    if (data.numeroClinica == null) {
      this.toastrService.danger('O campo numéro é obrigatório!!!');
    }
    if (data.ufId == null) {
      this.toastrService.danger('O campo estado é obrigatório!!!');
    }
    if (data.cityId == null) {
      this.toastrService.danger('O campo cidade é obrigatório!!!');
    }

  }

  isValidCpf(element, data) {
    if (element.id === 'cpf') {
      if (!CPFValidator.isValidCPF(data.cpf)) {
        this.showMsgErro = true;
        return false;
      }
      this.showMsgErro = false;
      return true;
    } else if (element.id === 'federalId') {
      if (!CPFValidator.isValidCPF(data.federalId)) {
        this.showMsgErroClinica = true;
        return false;
      }
      this.showMsgErroClinica = false;
      return true;
    }
  }

  proximo(data) {

    if (data.isInfoGerais == true) {
      this.isInfoGerais = false;
      this.isContato = false;
      this.isClinica = true
    } else if (data.isClinica == true) {
      this.isInfoGerais = false;
      this.isClinica = false;
      this.isContato = true;
    }
  }

  adicionar(data) {

    this.rowData.push(data)

    this.rowData = this.rowData.map(data => {
      return {
        name: data.name,
        socialName: data.socialName,
        federalId: data.federalId,
        ufId: data.ufId,
        cityId: data.cityId,
        cellPhone: data.cellPhone,
        zipCode: data.zipCode,
        street: data.street,
        neighborhood: data.neighborhood,
        number: data.numeroClinica,
        complement: data.complementoClinica,
      }
    })
  }

  limpaFormEnd() {
    this.formCadastroMedico.controls['name'].setValue(null);
    this.formCadastroMedico.controls['socialName'].setValue(null);
    this.formCadastroMedico.controls['federalId'].setValue(null);
    this.formCadastroMedico.controls['ufId'].setValue(null);
    this.formCadastroMedico.controls['cityId'].setValue(null);
    this.formCadastroMedico.controls['cellPhone'].setValue(null);
    this.formCadastroMedico.controls['zipCode'].setValue(null);
    this.formCadastroMedico.controls['street'].setValue(null);
    this.formCadastroMedico.controls['neighborhood'].setValue(null);
    this.formCadastroMedico.controls['numeroClinica'].setValue(null);
    this.formCadastroMedico.controls['complementoClinica'].setValue(null);

  }

  buscaClinica(data) {

    let cnpj = data.replace(/\D/g, '');

    if (data != null) {

      this.service.buscaClinica(cnpj, null, (response) => {

        this.buscaCidade(response.uf.id)

        setTimeout(() => {
          this.formCadastroMedico.controls['name'].setValue(response.name);
          this.formCadastroMedico.controls['socialName'].setValue(response.socialName);
          this.formCadastroMedico.controls['ufId'].setValue(response.uf.id);
          this.formCadastroMedico.controls['cityId'].setValue(response.city.id);
          this.formCadastroMedico.controls['cellPhone'].setValue(response.cellPhone);
          this.formCadastroMedico.controls['zipCode'].setValue(response.cep);
          this.formCadastroMedico.controls['street'].setValue(response.street);
          this.formCadastroMedico.controls['neighborhood'].setValue(response.neighborhood);
          this.formCadastroMedico.controls['numeroClinica'].setValue(response.number);
          this.formCadastroMedico.controls['complementoClinica'].setValue(response.complement);
        }, 20)

      }, (error) => {
        this.toastrService.danger(error.error.message);
        this.formCadastroMedico.controls['name'].setValue(null);
        this.formCadastroMedico.controls['socialName'].setValue(null);
        this.formCadastroMedico.controls['ufId'].setValue(null);
        this.formCadastroMedico.controls['cityId'].setValue(null);
        this.formCadastroMedico.controls['cellPhone'].setValue(null);
        this.formCadastroMedico.controls['zipCode'].setValue(null);
        this.formCadastroMedico.controls['street'].setValue(null);
        this.formCadastroMedico.controls['neighborhood'].setValue(null);
        this.formCadastroMedico.controls['numeroClinica'].setValue(null);
        this.formCadastroMedico.controls['complementoClinica'].setValue(null);
      });

    }



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
