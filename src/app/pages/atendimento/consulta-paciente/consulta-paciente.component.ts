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


    @ViewChild("inputFileReceita")
    private inputFileReceita: ElementRef;

    @ViewChild("inputFileAtestado")
    private inputFileAtestado: ElementRef;

    public formConsultaPaciente = null;
    public isActive = false;
    public isBnt = true;
    public isDetalhes = false;
    public tamInterno: number = 2000;
    public tamCliente: number = 2000;

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private toastrService: NbToastrService,
        private service: AtendimentoService) {

    }

    ngOnDestroy() { }
    ngOnInit() {

        this.formConsultaPaciente = this.formBuilder.group({
            detalhesCliente: [null],
            detalhesInterno: [null],
            tempoRetorno: [null],
            altura: [null],
            peso: [null],
            circCabeca: [null],
            circAbdomen: [null],
            urlReceita: [null],
            urlAtestado: [null],
        })

    }

    limpaForm() {

        this.formConsultaPaciente = this.formBuilder.group({
            detalhesCliente: [null],
            detalhesInterno: [null],
            tempoRetorno: [null],
            altura: [null],
            peso: [null],
            circCabeca: [null],
            circAbdomen: [null],
            urlReceita: [null],
            urlAtestado: [null],
        })

    }

    detalhesConsulta() {
        this.isDetalhes = true;
        this.isBnt = false
    }

    caracteresInterno() {

        let inpuBox = document.querySelector(".input-box"),
            textArea = inpuBox.querySelector("textarea");
        var caracteresRestantes = this.tamInterno;

        textArea.addEventListener("keyup", () => {

            let valLenght = textArea.value.length;
            this.tamInterno = caracteresRestantes - valLenght;
            valLenght < 30
                ? inpuBox.classList.add("error")
                : inpuBox.classList.remove("error");

        });
    }

    caracteresCliente() {

        let inpuBox = document.querySelector(".input"),
            textArea = inpuBox.querySelector("textarea");
        var caracteresRestantes = this.tamCliente;

        textArea.addEventListener("keyup", () => {

            let valLenght = textArea.value.length;
            this.tamCliente = caracteresRestantes - valLenght;
            valLenght < 30
                ? inpuBox.classList.add("error")
                : inpuBox.classList.remove("error");

        });
    }

    voltar() {
        this.isDetalhes = false;
        this.isBnt = true
    }

    onUploadReceita(event): void {

        let reader = new FileReader();

        if (event.target.files && event.target.files.length) {
            let file = event.target.files[0];
            this.inputFileReceita.nativeElement.innerText = file.name;

            let formData = new FormData();
            formData.append('receita', file, file.name);
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.formConsultaPaciente.patchValue({
                    receita: formData
                });
            };
        }

    }

    onUploadAtestado(event): void {

        let reader = new FileReader();

        if (event.target.files && event.target.files.length) {
            let file = event.target.files[0];
            this.inputFileAtestado.nativeElement.innerText = file.name;

            let formData = new FormData();
            formData.append('atestado', file, file.name);
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.formConsultaPaciente.patchValue({
                    atestado: formData
                });
            };
        }

    }

    previousPage() {
        this.router.navigate(['/pages/atendimento/buscar-atendimento'])
    }

}
