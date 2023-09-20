import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../shared/services/authenticationService.services';
import { Component, OnInit } from '@angular/core';
//import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'ngx-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {

  public formLogin = null;
  checked = false;
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    //private notifications: NotificationsService,
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

    //this.spinnerService.show();

    this.authenticationService.getToken(usuario, password)
      .subscribe(
        re => this.saveLogin(re),
        (error) => {
          //this.spinnerService.hide();
          console.log('entrei aqui dentro do erro')
          console.log(error.error.message)
         // this.notifications.error('teste error')    

        });

    //this.router.navigate(['/pages/dashboard']);
  }

  private saveLogin(result) {

    console.log(result)

    localStorage.clear();

    //this.spinnerService.hide();   

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

