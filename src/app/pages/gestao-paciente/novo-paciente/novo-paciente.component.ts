import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NovoPacienteService } from './novo-paciente.service';

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
  public isInformacao = true;
  public isLocalizacao = false;
  public isContato = false;
  public isAddFotos = false;
  public isVoltar = false;
  public isProximo = true;
  public isCadastrar = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: NovoPacienteService) { }

  ngOnDestroy() { }
  
  ngOnInit() {

    this.formNovoPaciente = this.formBuilder.group({
      codigo: [null],
      nome: [null],
      dataNascimento: [null],
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
      observacao: [null],
      conhecer: [null],
    })

  }

  tipoFormulario(data){
    console.log(data)
    if(data === 'informacao'){
      console.log('entrei aqui isInformacao')
      this.isInformacao = true;
      this.isLocalizacao = false;
      this.isContato = false;
      this.isAddFotos = false;
      this.isProximo = true;
      this.isCadastrar = false;
      this.isVoltar = false;
    }else if(data === 'localizacao'){
      console.log('entrei aqui isLocalizacao')
      this.isInformacao = false;
      this.isLocalizacao = true;
      this.isContato = false;
      this.isAddFotos = false;
      this.isProximo = true;
      this.isCadastrar = false;
      this.isVoltar = true;
    }else if(data === 'contato'){
      console.log('entrei aqui isContato')
      this.isInformacao = false;
      this.isLocalizacao = false;
      this.isContato = true;
      this.isAddFotos = false;
      this.isProximo = true;
      this.isCadastrar = false;
      this.isVoltar = true;
    }else if(data === 'addFotos'){
      console.log('entrei aqui isAddFotos')
      this.isInformacao = false;
      this.isLocalizacao = false;
      this.isContato = false;
      this.isAddFotos = true;
      this.isProximo = false;
      this.isCadastrar = true;
      this.isVoltar = true;
    }
  }

  proximo(data){
    
    if(data.isInformacao == true){
      console.log(data.isInformacao)
      console.log('entrei na primeira tela')
      this.isInformacao = false;
      this.isLocalizacao = true;
      this.isVoltar = true;
    }else if(data.isLocalizacao == true){
      console.log(data.isLocalizacao)
      console.log('entrei na segunda tela')
      this.isLocalizacao = false;
      this.isContato = true;
      this.isVoltar = true;
    }else if(data.isContato == true){
      console.log(data.isContato)
      console.log('entrei na terceira tela')
      this.isContato = false;
      this.isAddFotos = true;
      this.isProximo = false;
      this.isVoltar = true;
      this.isCadastrar = true;
    }
 
  }  

  voltar(data){

    if(data.isLocalizacao == true){      
      this.isLocalizacao = false;
      this.isInformacao = true;
      this.isVoltar = false;
      this.isProximo = true;
      this.isCadastrar = false;
    }else if(data.isContato == true){      
      this.isContato = false;
      this.isLocalizacao = true;
      this.isVoltar = true;
      this.isProximo = true;
      this.isCadastrar = false;
    }else if(data.isAddFotos == true){
      this.isAddFotos = false;
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
      console.log(error)
      //this.notifications.error(error.message);
      //this.limparForm();
    });

  }

  buscaConvenio() {   

    this.service.buscaConvenio(null, (response) => {
      console.log(response)
      this.listConvenio = response   
     
    }, (error) => {
      console.log(error)
      //this.notifications.error(error.message);
      //this.limparForm();
    });

  }

  previousPage(){
    this.router.navigate(['/pages/gestao-paciente/paciente'])
  }
}
