import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { AtendimentoService } from '../atendimento.service';
import { deCamelCase } from '@swimlane/ngx-datatable';
import { CPFValidator } from '../../shared/validators/CPFValidator';
import * as moment from 'moment';
import { concatMapTo } from 'rxjs-compat/operator/concatMapTo';

@Component({
    selector: 'ngx-novo-atendimento',
    styleUrls: ['./novo-atendimento.component.scss'],
    templateUrl: './novo-atendimento.component.html',
})
export class NovoAtendimentoComponent {

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
    public msgErro = 'CPF inválido!!!';
    public showMsgErro = false;
    public doctorId = null;
    public clinicId = null;
    public userId = null;
    public childId = [];
    public specialtyId = null;
    public listTipoConsulta = [];
    public rowData = [];
    public tipoCard = [];
    public isHorario = false;
    public isConfAtendimento = false;
    public dadosHorario = null;
    public isDadosAtendimento = false
    public tipoPagto = null;
    public dependente = null;
    public detalhes = 'Consulta de retorno';
    public retorno = null;
    public isEncaixe = false;
    public isEncaixe1 = false;
    public tipoCardEncaixe: any[] = [{
        id: '',
        horaInicio: '',
        horaFim: ''
    }];
    public encaixe = false;
    public dateEncaixe = null;

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private toastrService: NbToastrService,
        private service: AtendimentoService) {

        this.listTipoConsulta = [{
            id: 1,
            descricao: "Presencial"
        },
        {
            id: 2,
            descricao: "Video Chamada"
        },
        {
            id: 3,
            descricao: "Emergencial Presencial"
        },
        {
            id: 4,
            descricao: "Em Casa"
        },
        {
            id: 5,
            descricao: "Video Chamada Emergencial"
        }];

    }

    ngOnInit() {

        this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));
        this.verificaMedico(this.listMedico[0].id);
        this.pagamento();
        this.formNovoAtendimento = this.formBuilder.group({
            medico: [this.listMedico[0]],
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
            tipoEspecialidade: [null],
        })

        this.formNovoAtendimento.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });
        this.tipoCardEncaixe = [];
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

    buscaConvenio(data) {

        this.service.buscaConvenio(data, null, (response) => {

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

                if (response.length > 0) {
                    this.listDependente = response
                    this.childId = response[0].idChild
                } else {
                    this.childId = null;
                }

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
            tipoEspecialidade: [null],
        })

    }

    consultaDependente(data) {

        this.dependente = data
        if (this.childId == null) {
            this.toastrService.danger('Não possui dependente!!!');
            this.isDependente = false;
        } else {

            if (data == 'S') {
                this.isDependente = true;
            } else {
                this.isDependente = false;
            }

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

        if (data.cpf != null) {

            this.isActive = true;

            this.service.buscaPaciente(null, data.cpf, (response) => {
                this.isActive = false;
                this.userId = response.id
                this.formNovoAtendimento.controls['nomeResponsavel'].setValue(response.name);
                this.buscaDependente(this.userId)
                this.isDadosAtendimento = true
            }, (error) => {
                this.isActive = false;
                this.toastrService.danger(error.error.message);
            });

        } else {
            this.toastrService.danger('O campos CPF é obrigatórios!!!');
        }

    }

    isValidCpf(data) {

        this.listDependente = [];
        this.isDependente = false;

        if (!CPFValidator.isValidCPF(data.cpf)) {
            this.showMsgErro = true;
            this.isDadosAtendimento = false;
            this.formNovoAtendimento.controls['nomeResponsavel'].setValue(null);
            return false;
        }
        this.showMsgErro = false;
        this.pesquisaPaciente(data)
        return true;
    }

    consultaPaga(data) {

        if (data == "S") {
            this.tipoPagto = true
        } else {
            this.tipoPagto = false
        }
    }

    salvar(data) {


        if (this.dadosHorario.horario === undefined) {
            var startTime = this.tipoCardEncaixe[0].horaInicio
            var endTime = this.tipoCardEncaixe[0].horaFim
            this.dateEncaixe = moment(data.dataInicio).format('DD/MM/YYYY')
        } else {
            var startTime = this.dadosHorario.horario.slice(0, 5)
            var endTime = this.dadosHorario.horario.slice(8)
        }

        this.clinicId = localStorage.getItem('bway-entityId');

        if (this.dependente == 'N') {
            this.childId = null
        }

        let register = {

            doctorId: this.doctorId,
            clinicId: this.clinicId,
            userId: this.userId,
            childId: this.childId,
            dateService: data.dataInicio,
            startTime: startTime,
            endTime: endTime,
            healthPlanId: data.formaConvenio,
            typePaymentId: data.formaPagto,
            typeServiceId: data.tipoConsulta,
            meetingUrl: this.dadosHorario.data === undefined ? this.dateEncaixe.concat(' - ', this.userId, ' - ', startTime, ' - ', this.doctorId) : this.dadosHorario.data.concat(' - ', this.userId, ' - ', startTime, ' - ', this.doctorId),
            specialtyId: this.specialtyId,
            paymentInCreation: this.tipoPagto,
            isReturn: this.retorno,
            dontCheckAvailable: this.encaixe

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

        this.verificaEspecialidade(this.doctorId);
        this.buscaConvenio(this.doctorId);
    }

    verificaDependente(data) {

        for (var i = 0; i < this.listDependente.length; i++) {

            if (data == this.listDependente[i].idChild) {
                this.childId = this.listDependente[i].idChild
            }
        }

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

        let date = new Date(data.dataInicio)
        date.setDate(date.getDate() + 6)

        this.tipoCard = [];
        this.isConfAtendimento = false;

        if (this.validaCampo(data)) {

            this.isActive = true
            let params = new HttpParams();
            params = params.append('doctorId', data.medico)
            params = params.append('startDate', data.dataInicio)
            params = params.append('endDate', moment(date).format('YYYY-MM-DD'))
            params = params.append('typeServiceId', data.tipoConsulta)

            this.service.buscaHorario(params, (response) => {

                this.tipoCard = response.times;
                this.tipoCard = this.tipoCard.filter(function (item) {
                    if (item.status === 'Disponível') {
                        return true;
                    } else {
                        return false;
                    }
                });

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

    confHorario(data, element) {

        this.tipoCard = [];
        this.dadosHorario = data;
        if ((data.horaInicio != null) && (data.horaFim != null) && (element.dataInicio != null)) {
            this.isHorario = false;
            this.isConfAtendimento = true;
        }
        if ((data.data != null) && (data.horario != null) && (element.dataInicio != null)) {
            this.isHorario = false;
            this.isConfAtendimento = true;
        }

    }

    consultaRetorno(data) {

        if (data === 'S') {
            document.getElementById('consPagto').setAttribute('disabled', 'true');
            document.getElementById('radioSim').setAttribute('checked', 'true');
            document.getElementById('radioNao').setAttribute('disabled', 'true');
            this.formNovoAtendimento.controls['consPagto'].setValue(this.detalhes);
            this.retorno = true
        } else {
            document.getElementById('consPagto').removeAttribute('disabled');
            document.getElementById('radioNao').removeAttribute('disabled');
            document.getElementById('radioSim').removeAttribute('checked');
            this.formNovoAtendimento.controls['consPagto'].setValue(null);
            this.retorno = false
        }
    }

    previousPage() {
        this.router.navigate(['/pages/atendimento/buscar-atendimento'])
    }

    buscarEncaixe(data) {
        if (data === 'S') {
            this.isHorario = false;
            this.isEncaixe = false;
            this.isEncaixe1 = true;
            this.encaixe = true;
            if (this.tipoCardEncaixe.length === 0) {
                this.tipoCardEncaixe.push({
                    id: this.tipoCardEncaixe.length,
                })
            }
        } else {
            this.tipoCardEncaixe.splice(null);
            this.isEncaixe = true;
            this.isEncaixe1 = false;
            this.encaixe = false;
            this.isConfAtendimento = false;
        }
    }

    pesquisarHorario(data) {

        if (data.dataInicio === null) {
            this.toastrService.danger('A data início do período é obrigatória!!!');
            this.isConfAtendimento = false;
        } else {

            this.isActive = true
            let params = new HttpParams();
            params = params.append('doctorId', data.medico)
            params = params.append('dateService', moment(data.dataInicio).format('YYYY-MM-DD'))
            params = params.append('startTime', this.dadosHorario.horaInicio)
            params = params.append('endTime', this.dadosHorario.horaFim)

            this.service.timeAvailable(params, (response) => {
                this.isActive = false
                this.toastrService.success(response.message);
            }, (error) => {
                this.toastrService.danger(error.error.message);
            });

        }
    }

}
