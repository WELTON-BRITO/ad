import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { AtendimentoService } from '../atendimento.service';
import { deCamelCase } from '@swimlane/ngx-datatable';
import { CPFValidator } from '../../shared/validators/CPFValidator';

declare var $: any;

@Component({
    selector: 'ngx-novo-atendimento',
    styleUrls: ['./novo-atendimento.component.scss'],
    templateUrl: './novo-atendimento.component.html',
})
export class NovoAtendimentoComponent implements OnDestroy {

    public formNovoAtendimento = null;
    public listMedico = null;
    public isActive = false;
    public listPagto = null;
    public listDependente = null;
    public listConvenio = null;
    public isConvenio = false;
    public isPagto = false;
    public isDependente = false;
    public tamanho: number = 2000;
    public showMsgErro = false;
    public doctorId = null;
    public clinicId = null;
    public userId = null;
    public childId = null;
    public specialtyId = null;

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private toastrService: NbToastrService,
        private service: AtendimentoService) {

    }
    ngOnDestroy() { }
    ngOnInit() {

        var name = localStorage.getItem('bway-domain');
        var id = localStorage.getItem('bway-entityId');

        if (name == 'CLINIC') {
            this.pesquisaClinica(id)
        } else {
            this.pesquisaMedico(id);
        }

        this.pagamento();
        this.buscaConvenio();
        this.formNovoAtendimento = this.formBuilder.group({
            medico: [null],
            cpf: [null],
            dataConsulta: [null],
            horaConsulta: [null],
            consultaParticular: [null],
            consultaDependente: [null],
            formaPagto: [null],
            incluirDep: [null],
            consPagto: [null],
            nomeResponsavel: [null]
        })

    }

    pesquisaMedico(data) {

        this.isActive = true

        let params = new HttpParams();
        params = params.append('doctorId', data)

        this.service.buscaDoctor(params, (response) => {

            this.listMedico = response,
                this.isActive = false

        }, (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message);
        });

    }

    pesquisaClinica(data) {
        this.isActive = true
        this.service.buscaClinica(data, null, (response) => {

            this.listMedico = response,
                this.isActive = false

        }, (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message);
        });

    }

    pagamento() {
        this.isActive = true
        this.service.buscaPagamentos(null, (response) => {
            console.log(response)
            this.listPagto = response
            this.isActive = false

        }, (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message);
        });

    }

    buscaConvenio() {

        this.service.buscaConvenio(null, (response) => {

            console.log(response)
            this.listConvenio = response

        }, (error) => {
            this.toastrService.danger(error.error.message);
        });

    }

    buscaDependente(data) {

        if (data != null) {

            let params = new HttpParams();

            params = params.append('userId', data)

            this.isActive = true;

            this.service.buscaDependente(params, (response) => {
                console.log(response)
                this.childId = response[0].idChild
                this.listDependente = response
                this.isActive = false;
            }, (error) => {
                this.isActive = false;
                this.toastrService.danger(error.error.message);
            });

        } else {
            this.toastrService.danger('O campos CPF é obrigatórios!!!');
        }


    }

    limpaForm() {

        this.formNovoAtendimento = this.formBuilder.group({
            medico: [null],
            dataConsulta: [null],
            horaConsulta: [null],


        })

    }

    consultaDependente(data) {

        if (data == 'S') {
            this.isDependente = true;

        } else {
            this.isDependente = false;
        }
    }

    consultaParticular(data) {

        if (data == 'S') {
            this.isConvenio = false;
            this.isPagto = true;
        } else {
            this.isConvenio = true;
            this.isPagto = false;
        }
    }

    qdadeCaracteres() {

        let inpuBox = document.querySelector(".input-box"),
            textArea = inpuBox.querySelector("textarea");
        var caracteresRestantes = 2000;

        textArea.addEventListener("keyup", () => {

            let valLenght = textArea.value.length;
            this.tamanho = caracteresRestantes - valLenght;

            valLenght < 30
                ? inpuBox.classList.add("error")
                : inpuBox.classList.remove("error");

        });
    }

    pesquisaPaciente(data) {

        let params = new HttpParams();

        if (data.cpf != null) {
            params = params.append('federalId', data.cpf)

            this.isActive = true;

            this.service.buscaPaciente(params, (response) => {

                this.isActive = false;
                this.userId = response[0].user.id
                this.formNovoAtendimento.controls['nomeResponsavel'].setValue(response[0].user.name);
                this.buscaDependente(this.userId)
            }, (error) => {
                this.isActive = false;
                this.toastrService.danger(error.error.message);
            });

        } else {
            this.toastrService.danger('O campos CPF é obrigatórios!!!');
        }

    }

    isValidCpf(data) {

        if (!CPFValidator.isValidCPF(data.cpf)) {
            this.showMsgErro = true;
            return false;
        }
        this.showMsgErro = false;
        this.pesquisaPaciente(data)
        return true;
    }

    salvar(data) {
        console.log(data)

        this.clinicId = localStorage.getItem('bway-entityId');

        let register = {

            doctorId: this.doctorId,
            clinicId: this.clinicId,
            userId: this.userId,
            childId: this.childId,
            dateService: "2023-10-11",
            startTime: "string",
            endTime: "string",
            healthPlanId: data,
            typePaymentId: 0,
            typeServiceId: 0,
            meetingUrl: "string",
            specialtyId: this.specialtyId

        }

        console.log(register)

        this.isActive = true;

        /*this.service.salvarAgendamento(register, (response => {

            this.isActive = false;
            this.toastrService.success('Cadastrado com sucesso !!!');

        }), (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message);

        });*/


    }

    verificaMedico(data) {

        console.log(data)

        for (var i = 0; i < this.listMedico.length; i++) {


            if (data == this.listMedico[i].id) {
                console.log(this.listMedico[i])
                this.doctorId = this.listMedico[i].id
                this.specialtyId = this.listMedico[i].specialty[0].id
            }


        }


    }

    previousPage() {
        this.router.navigate(['/pages/atendimento/buscar-atendimento'])
      }

}
