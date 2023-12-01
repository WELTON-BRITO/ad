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
  showPass = false;
  public cnpjCpf = null;

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
          this.toastrService.danger(error.message);
        });
  }

  private saveLogin(result) {


    this.isActive = false;
    this.toastrService.success('Bem vindo a Aditi Care !');
    localStorage.clear();
    localStorage.setItem('Authorization', 'Bearer ' + result.token);
    localStorage.setItem('bway-logged-date', new Date().toString());
    localStorage.setItem('bway-domain', result.domain);
    localStorage.setItem('bway-entityId', result.entityId);
    localStorage.setItem('bway-enterprise-name', result.name)
    localStorage.setItem('bway-user', result.federalId),

      this.pesquisaMedico()

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

      }, (error) => {
        this.toastrService.danger(error.error.message);
      });

    }

  }

  toggleShowPass() {
    this.showPass = !this.showPass;
  }

  isCPF(): boolean {
    return this.cnpjCpf == null ? true : this.cnpjCpf.length < 12 ? true : false;
  }

  getCpfCnpjMask(): string {
    return this.isCPF() ? '000.000.000-009' : '00.000.000/0000-00';
  }
}

