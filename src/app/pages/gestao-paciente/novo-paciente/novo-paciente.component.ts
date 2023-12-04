import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NovoPacienteService } from './novo-paciente.service';
import { NbToastrService } from '@nebular/theme';
import { Observable, Subscriber } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { CPFValidator } from '../../shared/validators/CPFValidator';
import { SearchZipCodeService } from '../../shared/services/searchZipCode.services';

@Component({
  selector: 'ngx-novo-paciente',
  styleUrls: ['./novo-paciente.component.scss'],
  templateUrl: './novo-paciente.component.html',
})
export class NovoPacienteComponent implements OnDestroy {

  @ViewChild("informacao") informacao: ElementRef;

  public formNovoPaciente = null;
  public listConvenio = null;
  public listEstado = null;
  public listCidade = null;
  public isInformacao = true;
  public isLocalizacao = false;
  public isContato = false;
  public isAddDependente = false;
  public isVoltar = false;
  public isProximo = true;
  public isCadastrar = false;
  public isActive = false;
  public sexo = null;
  public listSanguino = null;
  public imagem = null;
  public imagemDep = null;
  public register = null;
  public listMedico = null;
  public doctorId = null;
  public avatar = null;
  public avatarDep = null;
  public msgErro = 'Data inválida!!!';
  public showMsgErro = false;
  public msgErroCpf = 'CPF inválido!!!';
  public showMsgErroCpf = false;
  public showMsgErroCpfDep = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: NovoPacienteService,
    private serviceCep: SearchZipCodeService,
    private toastrService: NbToastrService) {

    this.listSanguino = [
      {
        tipoSanguineo: '1',
        descricao: 'A'
      },
      {
        tipoSanguineo: '2',
        descricao: 'B'
      },
      {
        tipoSanguineo: '3',
        descricao: 'O'
      },
      {
        tipoSanguineo: '4',
        descricao: 'AB'
      },
      {
        tipoSanguineo: '5',
        descricao: 'O+'
      },
      {
        tipoSanguineo: '6',
        descricao: 'B+'
      },
      {
        tipoSanguineo: '7',
        descricao: 'B-'
      },
      {
        tipoSanguineo: '8',
        descricao: 'A+'
      },
      {
        tipoSanguineo: '9',
        descricao: 'A-'
      },
      {
        tipoSanguineo: '10',
        descricao: 'AB+'
      },
      {
        tipoSanguineo: '11',
        descricao: 'AB-'
      },
    ]
  }

  ngOnDestroy() { }

  ngOnInit() {

    this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));
    this.verificaMedico(this.listMedico[0].id);
    this.buscaEstado();
    this.buscaConvenio();
    this.formNovoPaciente = this.formBuilder.group({
      medico: [this.listMedico[0], Validators.required],
      codigo: [null],
      nome: [null],
      dateNasc: [null],
      nomeResp01: [null],
      nomeResp02: [null],
      cpf: [null],
      rg: [null],
      convenio: [null],
      estado: [null],
      cidade: [null],
      bairro: [null],
      numero: [null],
      endereco: [null],
      cep: [null],
      email: [null],
      foneRecado: [null],
      celular: [null],
      complemento: [null],
      nomeDep: [null],
      dateNascDep: [null],
      tipoSanguineo: [null],
      rgDep: [null],
      cpfDep: [null],
      imagem: [null],
      imagemDep: [null],
    })

    this.formNovoPaciente.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });

  }

  tipoFormulario(data) {

    if (data === 'informacao') {

      this.isInformacao = true;
      this.isLocalizacao = false;
      this.isContato = false;
      this.isAddDependente = false;
      this.isProximo = true;
      this.isCadastrar = false;
      this.isVoltar = false;
    } else if (data === 'localizacao') {

      this.isInformacao = false;
      this.isLocalizacao = true;
      this.isContato = false;
      this.isAddDependente = false;
      this.isProximo = true;
      this.isCadastrar = false;
      this.isVoltar = true;
    } else if (data === 'contato') {

      this.isInformacao = false;
      this.isLocalizacao = false;
      this.isContato = true;
      this.isAddDependente = false;
      this.isProximo = true;
      this.isCadastrar = false;
      this.isVoltar = true;
    } else if (data === 'addFotos') {

      this.isInformacao = false;
      this.isLocalizacao = false;
      this.isContato = false;
      this.isAddDependente = true;
      this.isProximo = false;
      this.isCadastrar = true;
      this.isVoltar = true;
    }
  }

  proximo(data) {

    if (data.isInformacao == true) {
      this.isInformacao = false;
      this.isLocalizacao = true;
      this.isContato = false;
      this.isAddDependente = false;
      this.isProximo = true;
      this.isCadastrar = false;
      this.isVoltar = true;

    } else if (data.isLocalizacao == true) {

      this.isInformacao = false;
      this.isLocalizacao = false;
      this.isContato = true;
      this.isAddDependente = false;
      this.isProximo = true;
      this.isCadastrar = false;
      this.isVoltar = true;

    } else if (data.isContato == true) {

      this.isInformacao = false;
      this.isLocalizacao = false;
      this.isContato = false;
      this.isAddDependente = true;
      this.isProximo = false;
      this.isCadastrar = true;
      this.isVoltar = true;

    }

  }

  voltar(data) {

    if (data.isLocalizacao == true) {
      this.isLocalizacao = false;
      this.isInformacao = true;
      this.isVoltar = false;
      this.isProximo = true;
      this.isCadastrar = false;
    } else if (data.isContato == true) {
      this.isContato = false;
      this.isLocalizacao = true;
      this.isVoltar = true;
      this.isProximo = true;
      this.isCadastrar = false;
    } else if (data.isAddDependente == true) {
      this.isAddDependente = false;
      this.isContato = true;
      this.isProximo = true;
      this.isVoltar = true;
      this.isCadastrar = false;
    }

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

      this.formNovoPaciente.controls['endereco'].setValue(response.logradouro.replace('Rua', '').replace('Avenida', '').trim());
      this.formNovoPaciente.controls['bairro'].setValue(response.bairro.trim());

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

  buscaConvenio() {

    this.service.buscaConvenio(null, (response) => {

      this.listConvenio = response

    }, (error) => {
      this.toastrService.danger(error.error.message);
    });

  }

  cadastrarPaciente(data) {

    if (data.nomeDep != null) {

      this.register = {
        doctorId: this.doctorId,
        user: {
          name: data.nome,
          birthDate: data.dateNasc,
          cellPhone: data.celular,
          email: data.email,
          avatar: this.imagem,
          cityId: data.cidade,
          ufId: data.estado,
          zipCode: data.cep,
          street: data.bairro,
          neighborhood: data.endereco,
          number: data.numero,
          complement: data.complemento,
          password: 'Teste@21*19',
          federalId: data.cpf,
        },
        child: {
          name: data.nomeDep,
          nameMother: data.nomeResp01,
          nameFather: data.nomeResp02,
          cpf: data.cpfDep,
          rg: data.rgDep,
          biologicalSex: this.sexo,
          birthCountry: null,
          birthDate: data.dateNascDep,
          ufId: data.estado,
          cityId: data.cidade,
          bloodType: data.tipoSanguineo,
          avatar: this.imagemDep,
          userId: null,
        }
      }

    } else {

      this.register = {
        doctorId: this.doctorId,
        user: {
          name: data.nome,
          birthDate: data.dateNasc,
          cellPhone: data.celular,
          email: data.email,
          avatar: this.imagem,
          cityId: data.cidade,
          ufId: data.estado,
          zipCode: data.cep,
          street: data.bairro,
          neighborhood: data.endereco,
          number: data.numero,
          complement: data.complemento,
          password: 'Teste@21*19',
          federalId: data.cpf,
        }

      }
    }

    if (data.nome === null) {
      this.toastrService.danger('O campo nome é obrigatório!!!');
    } else if (data.dateNasc === null) {
      this.toastrService.danger('O campo data nascimento é obrigatório!!!');
    } else if (data.cpf === null) {
      this.toastrService.danger('O campo CPF é obrigatório!!!');
    } else if (data.bairro === null) {
      this.toastrService.danger('O campo bairro é obrigatório!!!');
    } else if (data.cep === null) {
      this.toastrService.danger('O campo cep é obrigatório!!!');
    } else if (data.cidade === null) {
      this.toastrService.danger('O campo cidade é obrigatório!!!');
    } else if (data.endereco === null) {
      this.toastrService.danger('O campo endereco é obrigatório!!!');
    } else if (data.numero === null) {
      this.toastrService.danger('O campo numero é obrigatório!!!');
    } else if (data.estado === null) {
      this.toastrService.danger('O campo estado é obrigatório!!!');
    } else if (data.celular === null) {
      this.toastrService.danger('O campo celular é obrigatório!!!');
    } else if (data.email === null) {
      this.toastrService.danger('O campo email é obrigatório!!!');
    } else if (this.sexo === null) {
      this.toastrService.danger('O campo sexo biologico é obrigatório!!!');
    } else if ((data.nomeDep != null) && (data.dateNascDep === null)) {
      this.toastrService.danger('Os campos do dependente são obrigatórios!!!');
    } else if (this.showMsgErroCpf === true || this.showMsgErroCpfDep === true) {
      this.toastrService.danger('O campo cpf inválido!!!');
    } else {

      this.isActive = true;

      this.service.salvarPaciente(this.register, (response => {
        this.isActive = false;
        this.toastrService.success('Registro cadastrado com sucesso !!!');
        this.limparForm()
        this.previousPage()
      }), (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);
      });


    }
  }

  verificaMedico(data) {
    this.doctorId = data
  }

  viewdiv(data) {
    this.sexo = data;
  }

  limparForm() {

    this.formNovoPaciente = this.formBuilder.group({
      codigo: [null],
      nome: [null],
      dateNasc: [null],
      nomeResp01: [null],
      nomeResp02: [null],
      cpf: [null],
      rg: [null],
      convenio: [null],
      estado: [null],
      cidade: [null],
      bairro: [null],
      numero: [null],
      endereco: [null],
      cep: [null],
      email: [null],
      foneRecado: [null],
      celular: [null],
      complemento: [null],
      nomeDep: [null],
      dateNascDep: [null],
      tipoSanguineo: [null],
      rgDep: [null],
      cpfDep: [null],
      imagem: [null],
      imagemDep: [null]
    })

    this.avatar = null;
    this.avatarDep = null;

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

      if (element.id == 'imagem') {
        this.imagem = d.slice(d.indexOf(",") + 1);
        this.avatar = 'data:application/pdf;base64,' + this.imagem;
      } else {
        this.imagemDep = d.slice(d.indexOf(",") + 1);
        this.avatarDep = 'data:application/pdf;base64,' + this.imagemDep;
      }


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

  validaData(stringData) {

    var regExpCaracter = /[^\d]/;     //Expressão regular para procurar caracter não-numérico.
    var regExpEspaco = /^\s+|\s+$/g;  //Expressão regular para retirar espaços em branco.

    if (stringData.length != 10) {
      this.showMsgErro = true;
      return false;
    }

    let splitData = stringData.split('-');

    if (splitData.length != 3) {
      return false;
    }

    splitData[0] = splitData[0].replace(regExpEspaco, '');
    splitData[1] = splitData[1].replace(regExpEspaco, '');
    splitData[2] = splitData[2].replace(regExpEspaco, '');

    if ((splitData[0].length != 4) || (splitData[1].length != 2) || (splitData[2].length != 2)) {
      return false;
    }

    let ano = parseInt(splitData[0], 10);
    let mes = parseInt(splitData[1], 10) - 1;
    let dia = parseInt(splitData[2], 10);
    var novaData = new Date(ano, mes, dia);
    var hoje = new Date();

    if (novaData > hoje) {
      return false;
    }

    if ((novaData.getDate() != dia) || (novaData.getMonth() != mes) || (novaData.getFullYear() != ano)) {
      this.showMsgErro = true;
      return false;
    }
    else {
      this.showMsgErro = false;
      return true;
    }

  }

  isValidCpf(element, data) {

    if (element.id === 'cpf') {
      if (!CPFValidator.isValidCPF(data.cpf)) {
        this.showMsgErroCpf = true;
        return false;
      }
      this.showMsgErroCpf = false;
      return true;
    } else if (element.id === 'cpfDep') {
      if (!CPFValidator.isValidCPF(data.cpfDep)) {
        this.showMsgErroCpfDep = true;
        return false;
      }
      this.showMsgErroCpfDep = false;
      return true;
    }

  }

  previousPage() {
    this.router.navigate(['/pages/gestao-paciente/paciente'])
  }
}
