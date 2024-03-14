import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../shared/services/authenticationService.services';
import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { LoaderService } from '../shared/component/spinner/loarder/loader.service';
import { HttpParams } from '@angular/common/http';
import { LoginService } from './login.service';
import { CPFValidator } from '../shared/validators/CPFValidator';

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
  public msgErroCpf = 'O CPF é inválido';
  public showMsgErroCpf = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private toastrService: NbToastrService,
    private service: LoaderService,
    private serviceLogin: LoginService,
  ) { }

  ngOnInit() {

    this.formLogin = this.formBuilder.group({
      login: [null, Validators.required],
      password: [null, Validators.required],
      lembreMim: [null],
    });

  }

  login() {

    let usuario = this.formLogin.controls['login'].value.replace(/\D/g, '');
    let password = this.formLogin.controls['password'].value;

    var str = usuario.length;

    if (str == 11) {
      this.domain = 4
    } else {
      this.domain = 2
    }

    this.isActive = true;
    localStorage.setItem('Authorization', '1');

    this.service.loader

    this.authenticationService.getToken(usuario, password, this.domain)
      .subscribe(
        re => this.saveLogin(re),
        (error) => {    
              
          this.isActive = false;
          if(error.error.message == undefined){
            this.toastrService.danger('Sistema temporariamente indisponível','Aditi Care!' );
          }else{
            this.toastrService.danger(error.error.message);
          }
          
        });
  }

  private saveLogin(result) {

    this.toastrService.success('Bem Vindo ao Portal da Aditi', 'Aditi Care!')


        localStorage.clear();
    localStorage.setItem('Authorization', 'Bearer ' + result.token);
    localStorage.setItem('bway-logged-date', new Date().toString());
    localStorage.setItem('bway-domain', result.domain);
    localStorage.setItem('bway-entityId', result.entityId);
    localStorage.setItem('bway-enterprise-name', result.name);
    localStorage.setItem('bway-user', result.federalId);

    if (result.domain == 'CLINIC') {
    
    //Preenchendo os dados do combo do list do médico

    this.listMedico = result.doctors
    var b = this.listMedico
    b = JSON.stringify(b);
    sessionStorage.setItem('bway-medico', b);
    var c = JSON.parse(sessionStorage.getItem('bway-medico'));
    this.isActive = false;

    //Preenchendo os dados do combo da Clinica
    this.listClinica = [ { id: result.entityId, name: result.name }]
    var b = this.listClinica
    b = JSON.stringify(b);
    sessionStorage.setItem('bway-clinica', b);
    var c = JSON.parse(sessionStorage.getItem('bway-clinica'));
    this.isActive = false;

    }else if (result.domain == 'DOCTOR') {

    //Preenchendo os dados do combo do list do médico
    this.listMedico = [ { id: result.entityId, name: result.name }]
    var b = this.listMedico
    b = JSON.stringify(b);
    sessionStorage.setItem('bway-medico', b);
    var c = JSON.parse(sessionStorage.getItem('bway-medico'));
    this.isActive = false;

     //Preenchendo os dados do combo da Clinica

     this.listClinica = result.clinics
     var b = this.listClinica
     b = JSON.stringify(b);
     sessionStorage.setItem('bway-clinica', b);
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
        var c = JSON.parse(sessionStorage.getItem('bway-medico'));
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
        var c = JSON.parse(sessionStorage.getItem('bway-medico'));
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

  isCPF(): boolean {
    return this.cnpjCpf == null ? true : this.cnpjCpf.length < 12 ? true : false;
  }

  getCpfCnpjMask(): string {
    return this.isCPF() ? '00.000.000/0000-00' : '000.000.000-009';
  }

  isValidCpf(data) {

    if (data.login.length === 11) {
      if (!CPFValidator.isValidCPF(data.login)) {
        this.showMsgErroCpf = true;
        return false;
      }
      this.showMsgErroCpf = false;
      return true;
    }

    if (data.login.length === 14) {
      if (!CPFValidator.isValidCNPJ(data.login)) {
        this.showMsgErroCpf = true;
        return false;
      }
      this.showMsgErroCpf = false;
      return true;
    }

  }
}

