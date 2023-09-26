import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NovoPacienteService } from './novo-paciente.service';
import { NbToastrService } from '@nebular/theme';

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
  public isAddFotos = false;
  public isVoltar = false;
  public isProximo = true;
  public isCadastrar = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: NovoPacienteService,
    private toastrService: NbToastrService) { }

  ngOnDestroy() { }
  
  ngOnInit() {

    this.buscaEstado();
    this.buscaConvenio();
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

    if(data === 'informacao'){

      this.isInformacao = true;
      this.isLocalizacao = false;
      this.isContato = false;
      this.isAddFotos = false;
      this.isProximo = true;
      this.isCadastrar = false;
      this.isVoltar = false;
    }else if(data === 'localizacao'){

      this.isInformacao = false;
      this.isLocalizacao = true;
      this.isContato = false;
      this.isAddFotos = false;
      this.isProximo = true;
      this.isCadastrar = false;
      this.isVoltar = true;
    }else if(data === 'contato'){

      this.isInformacao = false;
      this.isLocalizacao = false;
      this.isContato = true;
      this.isAddFotos = false;
      this.isProximo = true;
      this.isCadastrar = false;
      this.isVoltar = true;
    }else if(data === 'addFotos'){

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
      
      this.isInformacao = false;
      this.isLocalizacao = true;
      this.isVoltar = true;
    }else if(data.isLocalizacao == true){
      
      this.isLocalizacao = false;
      this.isContato = true;
      this.isVoltar = true;
    }else if(data.isContato == true){
      
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
      this.toastrService.danger(error.error.message);     
    });

  }

  buscaCidade(data){
    
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

  previousPage(){
    this.router.navigate(['/pages/gestao-paciente/paciente'])
  }
}
