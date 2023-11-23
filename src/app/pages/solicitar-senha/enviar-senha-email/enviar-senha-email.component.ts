import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { SolicitarSenhaService } from '../solicitar-senha.service';

@Component({
  selector: 'ngx-enviar-senha-email',  
  styleUrls: ['./enviar-senha-email.component.scss'],
  templateUrl: 'enviar-senha-email.component.html',
})

export class EnviarSenhaEmailComponent implements OnInit {

  public formSolicitarSenha = null;
  public isActive = false;
  public isSolicitarSenha = null;
  public domainId = null;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: NbToastrService,
    private service: SolicitarSenhaService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.isSolicitarSenha = true
    this.formSolicitarSenha = this.formBuilder.group({
      email: [null, Validators.required],
      cpfCnpj: [null, Validators.required],
    });

  }

  enviar(data) {

    console.log(data)

    let register = {
      federalId: data.cpfCnpj,
      email: data.email,
      domainId: this.domainId
    }
    console.log(register)
    this.isActive = true;

    this.service.resetPassword(register, (response => {
      console.log(response)
      this.isActive = false;
      
      /*var str1 = data.email;
      var str2 = str1.slice(0, 4);
      var str3 = data.email.substr(data.email.indexOf('@') + 1);
  
      console.log(str2)
      console.log(str3)
  
     /* this.dialogService.open(ValidaTokenComponent, {
        context: {
          descricao: 'Sua solicitação de reset de senha foi feita com sucesso. Você receberá um e-mail com token em instantes com as instruções. Caso não receba este e-mail na caixa principal, verifique se o e-mail encontra-se na caixa de spam.',
          email: str2 + '*****' + str3
        },
      });

      this.isSolicitarSenha = false*/
      
    }), (error) => {
      this.isActive = false;
      console.log(error)
      this.toastrService.danger(error.message);
    });

  }

  resetSenha(data) {

  this.domainId = data;

  }


}

