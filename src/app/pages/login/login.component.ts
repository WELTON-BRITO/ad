import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../shared/services/authenticationService.services';
import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { LoaderService } from '../shared/component/spinner/loarder/loader.service';

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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private toastrService: NbToastrService,
    private service: LoaderService,
  ) { }

  ngOnInit() {
   
    localStorage.removeItem('bway-token');
    localStorage.removeItem('bway-logged-date');
    localStorage.removeItem('bway-domain');
    localStorage.removeItem('bway-entityId');

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
      
      if(str == 11){        
        this.domain = 4
      }else{
        this.domain = 2
      }      

    this.isActive = true;
    
    this.service.loader
    
    this.authenticationService.getToken(usuario, password, this.domain)
      .subscribe(
        re => this.saveLogin(re),
        (error) => {  
          this.isActive = false;    
          this.toastrService.danger(error.error.message);     
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

    this.router.navigate(['/pages/dashboard']);

  } 

  toggle(checked: boolean) {
    this.checked = checked;
  }


}

