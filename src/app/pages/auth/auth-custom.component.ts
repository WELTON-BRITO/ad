import { Component, OnInit } from '@angular/core';
import { NbAuthComponent } from '@nebular/auth';

@Component({
    selector: 'auth',
    styleUrls: ['./auth-custom.component.scss'],
    templateUrl: './auth-custom.component.html'
})
export class AuthCustomComponent extends NbAuthComponent implements OnInit {
   

    ngOnInit(){
    }
    

}