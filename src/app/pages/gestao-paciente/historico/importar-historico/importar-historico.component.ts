import { Component, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';

import * as moment from 'moment';

@Component({
    selector: 'ngx-importar-historico',
    styleUrls: ['./importar-historico.component.scss'],
    templateUrl: './importar-historico.component.html',
})
export class ImportarHistoricoComponent implements OnInit {

    public history = null;

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private toastrService: NbToastrService,
        private errorHandler: ErrorHandler) { }

    ngOnInit() {

        this.history = history.state;
    }

    previousPage() {
        this.router.navigate(['/pages/gestao-paciente/paciente'])
    }

}
