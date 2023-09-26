import {Component, OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-cadastro',
  styleUrls: ['./cadastro.component.scss'],
  templateUrl: './cadastro.component.html',
})

export class CadastroComponent implements OnInit {
   
  public formCadastro = null;

  constructor(private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {

    this.formCadastro = this.formBuilder.group({
      cnpj:[null, Validators.required],
      cpf:[null, Validators.required]
    });

  } 
  
  cadastro(data){
    
    if(data === 'medico'){  
      this.router.navigate(['/cadastro-medico']);       
    }else{
      this.router.navigate(['/cadastro-clinica']);
    }
    
  }

  voltar() {
    this.router.navigate(['/login']);
  }
}
