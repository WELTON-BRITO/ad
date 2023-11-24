import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Observable, Subscriber } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { CPFValidator } from '../../shared/validators/CPFValidator';
import { DependenteService } from './dependente.service';

@Component({
  selector: 'ngx-dependente',
  styleUrls: ['./dependente.component.scss'],
  templateUrl: './dependente.component.html',
})
export class DependenteComponent implements OnDestroy {

  public formDependente = null;
 
  public listEstado = null;
  public listCidade = null;
  public isActive = false;
  public sexo = null;
  public listSanguino = null;
  public imagem = null;
  public imagemDep = null;
  public register = null;
  public listMedico = null;
  public doctorId = null;
  public avatar = null;
  public msgErro = 'Data inválida!!!';
  public showMsgErro = false;
  public msgErroCpf = 'CPF inválido!!!';
  public showMsgErroCpf = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: DependenteService,
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
  
    this.formDependente = this.formBuilder.group({   
      nomeDep: [null],
      dateNascDep: [null],
      tipoSanguineo: [null],
      rgDep: [null],
      cpfDep: [null],
      imagem: [null],
      imagemDep: [null],
    })

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

  

  viewdiv(data) {
    this.sexo = data;
  }

  limparForm() {

    this.formDependente = this.formBuilder.group({    
      nomeDep: [null],
      dateNascDep: [null],
      tipoSanguineo: [null],
      rgDep: [null],
      cpfDep: [null],
      imagem: [null],
      imagemDep: [null]
    })

    this.avatar = null;

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
        this.showMsgErroCpf = true;
        return false;
      }
      this.showMsgErroCpf = false;
      return true;
    }

  }

  cadastrarPaciente(data){
    console.log(data)
  }

  previousPage() {
    this.router.navigate(['/pages/gestao-paciente/paciente'])
  }
}
