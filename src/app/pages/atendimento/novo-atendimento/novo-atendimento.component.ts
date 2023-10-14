import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { AtendimentoService } from '../atendimento.service';
import { deCamelCase } from '@swimlane/ngx-datatable';
import { CPFValidator } from '../../shared/validators/CPFValidator';
import * as moment from 'moment';

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
    public listTipoEspecialidade = null;
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
    public listTipoConsulta = [];
    public rowData = [];
    public tipoCard = [];
    public isHorario = false;
    public isConfAtendimento = false;
    public dadosHorario = null;
    public isDadosAtendimento = false

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private toastrService: NbToastrService,
        private service: AtendimentoService) {

        this.listTipoConsulta = [{
            id: 1,
            descricao: "Consulta Presencial"
        },
        {
            id: 2,
            descricao: "Consulta por Video conferência"
        },
        {
            id: 3,
            descricao: "Consulta Emergencial"
        }];

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
            dataInicio: [null],
            consultaParticular: [null],
            consultaDependente: [null],
            formaPagto: [null],
            formaConvenio: [null],
            incluirDep: [null],
            consPagto: [null],
            nomeResponsavel: [null],
            tipoConsulta: [null],
            tipoEspecialidade: [null]
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

            this.listPagto = response
            this.isActive = false

        }, (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message);
        });

    }

    buscaConvenio() {

        this.service.buscaConvenio(null, (response) => {

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
                this.childId = response[0].idChild
                this.listDependente = response
                this.isActive = false;
                this.isDadosAtendimento = true
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
            cpf: [null],
            dataInicio: [null],
            consultaParticular: [null],
            consultaDependente: [null],
            formaPagto: [null],
            formaConvenio: [null],
            incluirDep: [null],
            consPagto: [null],
            nomeResponsavel: [null],
            tipoConsulta: [null],
            tipoEspecialidade: [null]
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

        var startTime = this.dadosHorario.horario.slice(0, 5)
        var endTime = this.dadosHorario.horario.slice(8)
        this.clinicId = localStorage.getItem('bway-entityId');

        let register = {

            doctorId: this.doctorId,
            clinicId: this.clinicId,
            userId: this.userId,
            childId: this.childId,
            dateService: moment(this.dadosHorario.data, "DD/MM/YYYY").format("YYYY-MM-DD"),
            startTime: startTime,
            endTime: endTime,
            healthPlanId: data.formaConvenio,
            typePaymentId: data.formaPagto,
            typeServiceId: data.tipoConsulta,
            meetingUrl: this.dadosHorario.data.concat(' - ', this.userId, ' - ', startTime, ' - ', this.doctorId),
            specialtyId: this.specialtyId

        }

        this.isActive = true;

        this.service.salvarAgendamento(register, (response => {

            this.isActive = false;
            this.toastrService.success('Cadastrado com sucesso !!!');
            this.limpaForm();
            this.previousPage();
        }), (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message);

        });

    }

    verificaMedico(data) {

        for (var i = 0; i < this.listMedico.length; i++) {

            if (data == this.listMedico[i].id) {
                this.doctorId = this.listMedico[i].id
            }
        }

        this.verificaEspecialidade(this.doctorId)
    }

    especialidade(data) {

        for (var i = 0; i < this.listTipoEspecialidade.length; i++) {

            if (data == this.listTipoEspecialidade[i].id) {
                this.specialtyId = this.listTipoEspecialidade[i].id
            }
        }
    }

    verificaEspecialidade(data) {

        this.service.verificaEspecialidade(data, null, (response => {

            this.listTipoEspecialidade = response

        }), (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message);

        });

    }

    pesquisarConsulta(data) {

        this.isConfAtendimento = false;

        if (this.validaCampo(data)) {

            this.isActive = true
            let params = new HttpParams();
            params = params.append('doctorId', data.medico)
            params = params.append('startDate', data.dataInicio)
            params = params.append('endDate', data.dataInicio)
            params = params.append('typeServiceId', data.tipoConsulta)

            this.service.buscaHorario(params, (response) => {

                this.tipoCard = response.times,

                    this.tipoCard = this.tipoCard.map(data => {
                        return {
                            data: moment(data.date).format('DD/MM/YYYY'),
                            horario: data.startTime.concat(' - ', data.endTime)
                        }

                    })

                this.isActive = false
                this.isHorario = true;

            }, (error) => {
                this.isActive = false;
                this.toastrService.danger(error.error.message);
            });
        }
    }

    validaCampo(data) {

        if (data.medico == null) {
            this.toastrService.danger('O campo médico é obrigatório!!!');
            return false
        }
        if (data.tipoConsulta == null) {
            this.toastrService.danger('O campo tipo consulta é obrigatório!!!');
            return false
        }
        if (data.dataInicio == null) {
            this.toastrService.danger('A data início do período é obrigatória!!!');
            return false
        }

        return true
    }

    confHorario(data) {

        this.dadosHorario = data;
        this.isHorario = false;
        this.isConfAtendimento = true;
    }

    previousPage() {
        this.router.navigate(['/pages/atendimento/buscar-atendimento'])
    }

}
