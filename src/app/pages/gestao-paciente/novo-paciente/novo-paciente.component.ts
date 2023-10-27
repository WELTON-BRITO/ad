import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NovoPacienteService } from './novo-paciente.service';
import { NbToastrService } from '@nebular/theme';
import { Observable, Subscriber } from 'rxjs';
import { HttpParams } from '@angular/common/http';

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

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: NovoPacienteService,
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
    this.buscaEstado();
    this.buscaConvenio();
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
      imagemDep: [null],
      medico: [null]
    })

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
          bloodType: null,
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

  previousPage() {
    this.router.navigate(['/pages/gestao-paciente/paciente'])
  }
}
