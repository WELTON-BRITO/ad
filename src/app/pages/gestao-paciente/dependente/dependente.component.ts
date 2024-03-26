import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Observable, Subscriber } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { CPFValidator } from '../../shared/validators/CPFValidator';
import { DependenteService } from './dependente.service';
import * as moment from 'moment';

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
  public msgErro = 'Data inválida!!!';
  public showMsgErro = false;
  public msgErroCpf = 'CPF inválido!!!';
  public showMsgErroCpf = false;
  public history = null;
  public isCadastro = false;
  public isVisualizar = false;
  public rowData = [];
  public nameMae = null;
  public NewowData: any = {};
  public avatar = "assets/images/avatar.png";


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
      nomeMae: [null],
      nomePai: [null],
      cpfDep: [null],
      rgDep: [null],
      tipoSanguineo: [null],
      imagemDep: [null],
    })

    this.history = history.state;

    if (this.history.tipo == "cadastrar") {
      this.isCadastro = true;
      this.isVisualizar = false;
    } else {
      this.isCadastro = false;
      this.isVisualizar = true;
    }

  if (this.history.data && this.history.data.id !== null  ) {

    if(this.history.tipo !== "cadastrar"){

      this.nameMae = this.history.data.name

      let params = new HttpParams();
  
      params = params.append('userId', this.history.data.id)
  
      this.isActive = true;
  
      this.service.visualizarDependente(params, (response) => {
  
        this.isActive = false;
        this.rowData = response
  
        this.rowData = this.rowData.map(data => {
          return {
            name: data.name || null,
            email: data.email || null,
            telefone: data.cellPhone || null,
            federalId: data.federalId || null,
            idChild: data.idChild || null,
            nameMother: data.nameMother || null,
            nameFather: data.nameFather || null,
            cpf: data.cpf || null,
            rg: data.rg || null,
            biologicalSex: data.biologicalSex || null,
            dateRegister: data.dateRegister || null,
            birthCountry: data.birthCountry || null,
            birthDate: data.birthDate || null,
            birthState: data.birthState || null,
            birthCity: data.birthCity || null,
            bloodType: data.bloodType || null,
            avatar: data.avatar
              ? 'data:application/pdf;base64,' + data.avatar
              : this.avatar || null,
            status: data.status || null,
          }
        })
        
  
      }, (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);
      });

      
    }else{

      this.NewowData = {
        name: this.history.data.name || null,
        email: this.history.data.email || null,
        telefone: this.history.data.cellPhone || null,
        federalId: this.history.data.federalId || null,
        idChild: this.history.data.idChild || null,
        nameMother: this.history.data.nameMother || null,
        nameFather: this.history.data.nameFather || null,
        cpf: this.history.data.cpf || null,
        rg: this.history.data.rg || null,
        biologicalSex: this.history.data.biologicalSex || null,
        dateRegister: this.history.data.dateRegister || null,
        birthCountry: this.history.data.birthCountry || null,
        birthDate: this.history.data.birthDate || null,
        birthState: this.history.data.birthState || null,
        birthCity: this.history.data.birthCity || null,
        bloodType: this.history.data.bloodType || null,
        avatar: this.history.data.avatar
          ? 'data:application/pdf;base64,' + this.history.data.avatar
          : this.avatar || null,
        status: this.history.data.status || null,
      };
          }

  }else{
    this.previousPage()
  }

  
  }

  buscaAgenda(data){
    this.router.navigateByUrl('/pages/gestao-paciente/visualizar-AgendaHistorico', { state: data });

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

  EditarDependente(data){
    this.router.navigateByUrl('/pages/gestao-paciente/editar-dependente', { state: data });

  }

  viewdiv(data) {
    this.sexo = data;
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
        this.toastrService.danger('Cpf Informado é Inválido','Aditi Care');
        return false;
      }
      return true;
    } else if (element.id === 'cpfDep') {
      if (!CPFValidator.isValidCPF(data.cpfDep)) {
        this.toastrService.danger('Cpf Informado é Inválido','Aditi Care');
        return false;
      }
      return true;
    }

  }

  cadastrarPaciente(data) {
    
    let register = {
      name: data.nomeDep,
      nameMother: this.history.data.name || data.nameMother,
      nameFather: null,
      cpf: data.cpfDep,
      rg: data.rgDep,
      biologicalSex: this.sexo,
      birthCountry: null,
      birthDate: data.dateNascDep,
      ufId: this.history.data.uf,
      cityId: this.history.data.city,
      bloodType: data.tipoSanguineo,
      avatar: this.avatar,
      userId: this.history.data.id
    }

    if ((data.nomeDep != null) && (data.nameMother != null || this.history.data.name != null ) && (data.dateNascDep != null) && (this.sexo != null)) {

      this.isActive = true;

      this.service.cadastrarDependente(register, (response => {
        this.isActive = false;
        this.toastrService.success('Inclusão Realizada com Sucesso','Aditi Care');
        this.limpaForm()
      }), (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);
      });
    } else {
      this.isActive = false;
      this.toastrService.danger('Preencher Preencher os Campos Obrigatorio','Aditi Care');
    }


  }

  limpaForm() {

    this.formDependente = this.formBuilder.group({
      nomeDep: [null],
      dateNascDep: [null],
      nomeMae: [null],
      nomePai: [null],
      cpfDep: [null],
      rgDep: [null],
      tipoSanguineo: [null],
      imagemDep: [null],
    })

    this.sexo = null;
    this.history.data.uf = null;
    this.history.data.city = null;
    this.avatar = null;
    this.history.data.id = null;
  }

  previousPage() {
    this.router.navigate(['/pages/gestao-paciente/paciente'])
  }
}
