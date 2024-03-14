import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { SolicitarSenhaService } from '../solicitar-senha.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.scss']
})
export class AlterarSenhaComponent implements OnInit {

  public novaSenhaForm: FormGroup;
  public showPass = false;
  public showRepeatPass = false;
  public isActive = false;
  public dados = null;
  public confirmarSenha = null;
  public senha = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: SolicitarSenhaService,
    private toastrService: NbToastrService,
  ) { }

  ngOnInit() {

    this.dados = history.state
    localStorage.setItem('Authorization', '1');
    this.novaSenhaForm = this.formBuilder.group({
      newPassword: [null, Validators.required],
      repetirSenha: [null, Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.novaSenhaForm = null;
  }

  alterarSenha(data) {

    let register = {
      password: data.newPassword,
      federalId: this.dados.federalId,
      domainId: this.dados.domainId,
      code: this.dados.code
    }

    this.isActive = true;

    this.service.validateCode(register, (response => {

      this.isActive = false;
      this.toastrService.success('Senha Alterada com Sucesso','Aditi Care!');
      this.router.navigate(['/login']);

    }), (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);
    });
  }

  toggleShowPass() {
    this.showPass = !this.showPass;
  }

  toggleShowRepeatPass() {
    this.showRepeatPass = !this.showRepeatPass;
  }

  validarSenhas = (data): ValidatorFn => {

    this.confirmarSenha = data.repetirSenha;

    if (this.novaSenhaForm) {

      this.senha = this.novaSenhaForm.get('newPassword').value

    }

    if (this.senha != this.confirmarSenha) {

      document.getElementById('bnt-alterar').setAttribute('disabled', 'true');
      this.toastrService.warning('Senha não confere !!!');

    } else {
      document.getElementById('bnt-alterar').removeAttribute('disabled');
    }

    return null;
  }

}
