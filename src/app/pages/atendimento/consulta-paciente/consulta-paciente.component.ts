import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { AtendimentoService } from '../atendimento.service';

@Component({
    selector: 'ngx-consulta-paciente',
    styleUrls: ['./consulta-paciente.component.scss'],
    templateUrl: './consulta-paciente.component.html',
})
export class ConsultaPacienteComponent implements OnDestroy {

    public formConsultaPaciente = null;
    public isActive = false;

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private toastrService: NbToastrService,
        private service: AtendimentoService) {

      
    }
    ngOnDestroy() { }
    ngOnInit() {

        this.formConsultaPaciente = this.formBuilder.group({
            medico: [null],
            cpf: [null],
            dataInicio: [null],
            consultaParticular: [null],
            consultaDependente: [null],
            formaPagto: [null],
            formaConvenio: [null],
            incluirDep: [null],
            consPagto: [null],
            nomeResponsavel: [null],
            tipoConsulta: [null]
        })

    }   

    limpaForm() {

        this.formConsultaPaciente = this.formBuilder.group({
            medico: [null],
            cpf: [null],
            dataInicio: [null],
            consultaParticular: [null],
            consultaDependente: [null],
            formaPagto: [null],
            formaConvenio: [null],
            incluirDep: [null],
            consPagto: [null],
            nomeResponsavel: [null],
            tipoConsulta: [null]
        })

    }    

    previousPage() {
        this.router.navigate(['/pages/atendimento/buscar-atendimento'])
    }

}
