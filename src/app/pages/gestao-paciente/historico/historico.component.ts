import { Component, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';

import * as moment from 'moment';
import { GestaoPacienteService } from '../gestao-paciente.service';

@Component({
    selector: 'ngx-historico',
    styleUrls: ['./historico.component.scss'],
    templateUrl: './historico.component.html',
})
export class HistoricoComponent implements OnInit {

    public history = null;
    public rowData = [];

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private toastrService: NbToastrService,
        private errorHandler: ErrorHandler,
        private service: GestaoPacienteService) { }

    ngOnInit() {

        this.history = history.state;
        console.log(this.history)
    }

    consultaHistorico() {

        let params = new HttpParams();

        params = params.append('doctorId', this.history.doctorId);
        params = params.append('userId', this.history.id);

        this.service.appointments(params, (response) => {

            console.log(response)
            this.rowData = response;
            this.router.navigateByUrl('/pages/atendimento/consulta-paciente', { state: this.rowData });
            
        }, (error) => {
            this.toastrService.danger(error.message);
        });


    }

    importarHistorico() {
        this.router.navigateByUrl('/pages/gestao-paciente/importar-historico', { state: this.history });
    }

    previousPage() {
        this.router.navigate(['/pages/gestao-paciente/paciente'])
    }

}
