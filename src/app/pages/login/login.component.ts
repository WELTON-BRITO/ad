import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../shared/services/authenticationService.services';
import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { LoaderService } from '../shared/component/spinner/loarder/loader.service';
//import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'ngx-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {

  public formLogin = null;
  checked = false;
  public isActive = false;

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
      login: ['', Validators.required],
      password: ['', Validators.required],
      lembreMim: [null],
    });

  }

  login() {

    let usuario = this.formLogin.controls['login'].value;
    let password = this.formLogin.controls['password'].value;

    this.isActive = true;
    
    this.service.loader

    this.authenticationService.getToken(usuario, password)
      .subscribe(
        re => this.saveLogin(re),
        (error) => {  
          this.isActive = false;        
          this.toastrService.danger(error.error.message);           
        });
  }

  private saveLogin(result) {

    this.isActive = false;
    this.toastrService.success('Sucesso!!!');  
    
    localStorage.clear();
    localStorage.setItem('Authorization', 'Bearer ' + result.token);
    localStorage.setItem('bway-logged-date', new Date().toString());
    localStorage.setItem('bway-domain', result.domain);
    localStorage.setItem('bway-entityId', result.entityId);

    this.router.navigate(['/pages/dashboard']);

  }

  register() {
    this.router.navigate(['/cadastro']);
  }

  toggle(checked: boolean) {
    this.checked = checked;
  }


}

