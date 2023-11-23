import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AlterarSenhaService } from './alterar-senha.service';
import { debounceTime } from 'rxjs/operators';

interface IAlterPasswordFormProps {
  newPassword: string;
  repetirSenha: string;
}

@Component({
  selector: 'ngx-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.scss']
})
export class AlterarSenhaComponent implements OnInit, OnDestroy {

  novaSenhaForm: FormGroup;
  showPass = false;
  showRepeatPass = false;
  
  constructor(
    private router: Router,    
  ) { }

  ngOnInit() {   
     }

  ngOnDestroy(): void {
    this.novaSenhaForm = null;
  }

  alterarSenha(data){
    console.log(data)
  }

  toggleShowPass() {
    this.showPass = !this.showPass;
  }

  toggleShowRepeatPass() {
    this.showRepeatPass = !this.showRepeatPass;
  }

  goBack() {
    this.ngOnDestroy()
    this.router.navigate(['/iot-dashboard']);
  }

}
