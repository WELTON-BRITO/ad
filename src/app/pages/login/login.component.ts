import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../shared/services/authenticationService.services';
import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { LoaderService } from '../shared/component/spinner/loarder/loader.service';
import { HttpParams } from '@angular/common/http';
import { LoginService } from './login.service';
 
@Component({
  selector: 'ngx-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {

  public formLogin = null;
  checked = false;
  public isActive = false;
  public domain = null;
  public listMedico = null;
  public listClinica = null;
  showPass = false;
  public cnpjCpf = null;
  public isLoader: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private toastrService: NbToastrService,
    public service: LoaderService,
    private serviceLogin: LoginService,
  ) { }

  ngOnInit() {

    this.formLogin = this.formBuilder.group({
      login: [null, Validators.required],
      password: [null, Validators.required],
        });

  }
  formatCpfCnpj(value: string): string {
    if (typeof value !== 'string') {
        return ''; // Retorna uma string vazia se não for uma string
    }

    value = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

    if (value.length < 11) {

      this.toastrService.warning('O Cpf/CNPJ Informado Não é Válido', 'Aditi Care');
     
    } else if (value.length== 11) {
        // CPF: 000.000.000-00
        var formattedValue = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        this.formLogin.get('login').setValue(formattedValue); // Atualiza o valor do campo
        this.BaseValidCPF(value);
        return formattedValue;
    } else {
        // CNPJ: 00.000.000/0000-00
        var formattedValue = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        this.formLogin.get('login').setValue(formattedValue); // Atualiza o valor do campo
        this.BaseValidCNPJ(value);
        return formattedValue;
    }

}

BaseValidCNPJ(value) {
  // Verifica se a variável cnpj é igua a "undefined", exibindo uma msg de erro
  if (value === undefined) {
    this.toastrService.warning('O CNPJ Informado Não é Válido', 'Aditi Care');
    return false;
  }

  // Esta função retira os caracteres . / - da string do cnpj, deixando apenas os números 
  var strCNPJ = value.replace('.', '').replace('.', '').replace('/', '').replace('-', '');

  // Testa as sequencias que possuem todos os dígitos iguais e se o cnpj não tem 14 dígitos, retonando falso e exibindo uma msg de erro
  if (strCNPJ === '00000000000000' || strCNPJ === '11111111111111' || strCNPJ === '22222222222222' || strCNPJ === '33333333333333' ||
    strCNPJ === '44444444444444' || strCNPJ === '55555555555555' || strCNPJ === '66666666666666' || strCNPJ === '77777777777777' ||
    strCNPJ === '88888888888888' || strCNPJ === '99999999999999' || strCNPJ.length !== 14) {
      this.toastrService.warning('O CNPJ Informado Não é Válido', 'Aditi Care');
      return false;
  }

  // A variável numeros pega o bloco com os números sem o DV, a variavel digitos pega apenas os dois ultimos numeros (Digito Verificador).
  var tamanho = strCNPJ.length - 2;
  var numeros = strCNPJ.substring(0, tamanho);
  var digitos = strCNPJ.substring(tamanho);
  var soma = 0;
  var pos = tamanho - 7;

  // Os quatro blocos seguintes de funções irá reaizar a validação do CNPJ propriamente dito, conferindo se o DV bate. Caso alguma das funções não consiga verificar
  // o DV corretamente, mostrará uma mensagem de erro ao usuário e retornará falso, para que o usário posso digitar novamente um número 
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(0)) {
    this.toastrService.warning('O CNPJ Informado Não é Válido', 'Aditi Care');
    return false;
  }

  tamanho = tamanho + 1;
  numeros = strCNPJ.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let k = tamanho; k >= 1; k--) {
    soma += numeros.charAt(tamanho - k) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(1)) {
    this.toastrService.warning('O CNPJ Informado Não é Válido', 'Aditi Care');
    return false;
  }
  return true;
}

  recuperarSenha()
  {

    this.router.navigate(['/enviar-senha-email']);

  }

  fetchData(data) {
    if(data){
    // Mostra o loader
    this.isLoader =true
    }else{
      setTimeout(() => {
        // Oculta o loader após o atraso
        this.isLoader =false
    }, 2000);
}
}

  login() {

    this.fetchData(true)

    let usuario = this.formLogin.controls['login'].value.replace(/\D/g, '');
    let password = this.formLogin.controls['password'].value;
    
    if (usuario !== null && usuario.length > 0 && password !== null && password.length > 0 && usuario.length >= 11) {
 
    this.formatCpfCnpj(usuario);

    if (usuario.length == 11) {
      this.domain = 4
      if(!this.BaseValidCPF(usuario)){
        this.fetchData(false)
        return false
      }

    } else {
      this.domain = 2
      if(!this.BaseValidCNPJ(usuario)){
        this.fetchData(false)
        return false
      }
    }
 
    this.isActive = true;
    this.service.loader

    localStorage.setItem('Authorization', '1');

    this.authenticationService.getToken(usuario, password, this.domain)
      .subscribe(
        re => this.saveLogin(re),
        (error) => {    
          this.isActive = false;
          if(error.error.message == undefined){
            this.toastrService.danger('Sistema Temporariamente Indisponível','Aditi Care' );
            this.fetchData(false)
          }else{
            this.toastrService.danger('Usuário ou Senha Não Estão Corretos','Aditi Care' );
            this.fetchData(false)
          }
        });

      }else{
        this.toastrService.danger('Por Favor Prencha Corretamente os Campos','Aditi Care' );
        this.fetchData(false)

      }
    
  }

  private saveLogin(result) {
    
    this.toastrService.success('Bem Vindo ao Portal Aditi Care!', 'Aditi Care');

    this.fetchData(false)

    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('Authorization', 'Bearer ' + result.token);
    localStorage.setItem('bway-logged-date', new Date().toString());
    localStorage.setItem('bway-domain', result.domain);
    localStorage.setItem('bway-entityId', result.entityId);
    localStorage.setItem('bway-enterprise-name', result.name);
    localStorage.setItem('bway-user', this.formatCpfCnpj(result.federalId));

    sessionStorage.setItem('Authorization', 'Bearer ' + result.token);
    sessionStorage.setItem('bway-logged-date', new Date().toString());
    sessionStorage.setItem('bway-domain', result.domain);
    sessionStorage.setItem('bway-entityId', result.entityId);
    sessionStorage.setItem('bway-enterprise-name', result.name);
    sessionStorage.setItem('bway-user', this.formatCpfCnpj(result.federalId));

    if (result.domain == 'CLINIC') {
    
    //Preenchendo os dados do combo do list do médico

    this.listMedico = result.doctors
    var b = this.listMedico
    b = JSON.stringify(b);
    localStorage.setItem('bway-medico', b);
    sessionStorage.setItem('bway-medico', b);
    var c = JSON.parse(localStorage.getItem('bway-medico'));
    var c = JSON.parse(sessionStorage.getItem('bway-medico'));

    this.isActive = false;

    //Preenchendo os dados do combo da Clinica
    this.listClinica = [ { id: result.entityId, name: result.name }]
    var b = this.listClinica
    b = JSON.stringify(b);
    localStorage.setItem('bway-clinica', b);
    sessionStorage.setItem('bway-clinica', b);
    var c = JSON.parse(localStorage.getItem('bway-clinica'));
    var c = JSON.parse(sessionStorage.getItem('bway-clinica'));

    this.isActive = false;

    }else if (result.domain == 'DOCTOR') {

    //Preenchendo os dados do combo do list do médico
    this.listMedico = [ { id: result.entityId, name: result.name }]
    var b = this.listMedico
    b = JSON.stringify(b);
    localStorage.setItem('bway-medico', b);
    sessionStorage.setItem('bway-medico', b);
    var c = JSON.parse(localStorage.getItem('bway-medico'));
    var c = JSON.parse(sessionStorage.getItem('bway-medico'));

    this.isActive = false;

     //Preenchendo os dados do combo da Clinica

     this.listClinica = result.clinics
     var b = this.listClinica
     b = JSON.stringify(b);
     localStorage.setItem('bway-clinica', b);
     sessionStorage.setItem('bway-clinica', b);
     var c = JSON.parse(localStorage.getItem('bway-clinica'));
     var c = JSON.parse(sessionStorage.getItem('bway-clinica'));
     this.isActive = false;

    }

   //   this.pesquisaMedico() Desativado após a inclusão dos dados  do médico da clinica no serviço de login


     this.router.navigate(['/pages/dashboard']);

  }

  toggle(checked: boolean) {
    this.checked = checked;
  }

  pesquisaMedico() {

    var name = localStorage.getItem('bway-domain');
    var id = localStorage.getItem('bway-entityId');

    if (name == 'CLINIC') {

      this.serviceLogin.buscaClinica(id, null, (response) => {

        this.listMedico = response
        var b = this.listMedico
        b = JSON.stringify(b);
        sessionStorage.setItem('bway-medico', b);
        var c = JSON.parse(localStorage.getItem('bway-medico'));
        this.isActive = false;
      }, (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);
      });

    } else {

      let params = new HttpParams();
      params = params.append('doctorId', id)

      this.serviceLogin.buscaDoctor(params, (response) => {

        this.listMedico = response
        var b = this.listMedico
        b = JSON.stringify(b);
        sessionStorage.setItem('bway-medico', b);
        var c = JSON.parse(localStorage.getItem('bway-medico'));
        this.isActive = false;
      }, (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);
      });

      this.isActive = false;
    }

  }

  toggleShowPass() {
    this.showPass = !this.showPass;
  }

  BaseValidCPF(cpf) {
    if (typeof cpf !== "string") return false
    cpf = cpf.replace(/[\s.-]*/igm, '')
    if (
        !cpf ||
        cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999" 
    ) {
      this.toastrService.warning('O Cpf/CNPJ Informado Não é Válido', 'Aditi Care');
        return false
    }
    var soma = 0
    var resto
    for (var i = 1; i <= 9; i++) 
        soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i)
    resto = (soma * 10) % 11
    if ((resto == 10) || (resto == 11))  resto = 0
    if (resto != parseInt(cpf.substring(9, 10)) ) 
    this.toastrService.warning('O Cpf/CNPJ Informado Não é Válido', 'Aditi Care');
    soma = 0
    for (var i = 1; i <= 10; i++) 
        soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i)
    resto = (soma * 10) % 11
    if ((resto == 10) || (resto == 11))  resto = 0
    if (resto != parseInt(cpf.substring(10, 11) ) )this.toastrService.warning('O Cpf/CNPJ Informado Não é Válido', 'Aditi Care');
    return true
}

}

