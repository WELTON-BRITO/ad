import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { AtendimentoService } from '../atendimento.service';
import { CPFValidator } from '../../shared/validators/CPFValidator';
import * as moment from 'moment';

@Component({
    selector: 'ngx-agendar-consulta',
    styleUrls: ['./agendar-consulta.component.scss'],
    templateUrl: './agendar-consulta.component.html',
})
export class AgendarConsultaComponent {

    public formAgendarConsulta = null;
    public listMedico = null;
    public isActive = false;
    public listPagto = null;
    public listDependente = null;
    public listTipoEspecialidade = null;
    public listConvenio = null;
    public isConvenio = false;
    public isPagto = false;
    public tamanho: number = 2000;
    public doctorId = null;
    public clinicId = null;
    public userId = null;
    public childId = [];
    public specialtyId = null;
    public listTipoConsulta = [];
    public rowData = [];
    public tipoCard = [];
    public isHorario = false;
    public dadosHorario = null;
    public isDadosAtendimento = false
    public tipoPagto = null;
    public dependente = null;
    public detalhes = 'Consulta de retorno';
    public retorno = null;
    public agendaConsulta = {
        waitingServiceId: null,
        nomeResponsavel: null,
        cpfResponsavel: null,
        nomeDependente: null,
        cpfDependente: null,
        idDependente: null,
        idMae: null
    };
    public isDependente = false;

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

        let data = history.state

        this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));
        this.verificaMedico(this.listMedico[0].id);
        this.pagamento();

        this.formAgendarConsulta = this.formBuilder.group({
            medico: [this.listMedico[0]],
            cpf: [null],
            dataInicio: [null],
            consultaParticular: [null],
            formaPagto: [null],
            formaConvenio: [null],
            consPagto: [null],
            nomeResponsavel: [null],
            tipoConsulta: [null],
            tipoEspecialidade: [null],
        })

        this.agendaConsulta.waitingServiceId = data.id;
        this.agendaConsulta.nomeResponsavel = data.nameMae != null ? data.nameMae : data.user.name;
        this.agendaConsulta.cpfResponsavel = data.cpfMae != null ? data.cpfMae : data.user.federalId;
        this.agendaConsulta.idMae = data.idMae != null ? data.idMae : data.user.id
        if (data.cpfDependente != null) {
            this.isDependente = true
            this.agendaConsulta.nomeDependente = data.name
            this.agendaConsulta.cpfDependente = data.cpfDependente
            this.agendaConsulta.idDependente = data.idDependente
        } else {
            this.isDependente = false
        }

        if (data.cpfMae != null) {
            document.getElementById('idMedico').removeAttribute('disabled');
            document.getElementById('idEspecialidade').removeAttribute('disabled');
        } else {
            this.formAgendarConsulta.controls['tipoEspecialidade'].setValue(data.specialty.id, { onlySelf: true });
            this.formAgendarConsulta.controls['medico'].setValue(data.doctor.id, { onlySelf: true });
            this.formAgendarConsulta.controls['tipoConsulta'].setValue(data.typeServiceEntity.id, { onlySelf: true });
        }

        if (data.dateService != null) {
            this.isDadosAtendimento = true;
            this.formAgendarConsulta.controls['dataInicio'].setValue(data.dateService);
        }

        this.formAgendarConsulta.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });
        this.formAgendarConsulta.controls['tipoConsulta'].setValue(data.typeServiceId, { onlySelf: true });

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

        this.formAgendarConsulta = this.formBuilder.group({
            medico: [null],
            cpf: [null],
            dataInicio: [null],
            consultaParticular: [null],
            formaPagto: [null],
            formaConvenio: [null],
            consPagto: [null],
            nomeResponsavel: [null],
            tipoConsulta: [null],
            tipoEspecialidade: [null],
        })

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
                this.formAgendarConsulta.controls['nomeResponsavel'].setValue(response.name);
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

    salvar(data) {

        this.clinicId = localStorage.getItem('bway-entityId');

        if (this.validaCampos(data)) {

            this.isActive = true;

            if (data.cpfMae != null) {

                let register = {
                    doctorId: this.doctorId,
                    clinicId: this.clinicId,
                    dateProposal: this.dadosHorario.dateProposal,
                    description: data.consPagto,
                    typeServiceId: data.tipoConsulta,
                    startTime: this.dadosHorario.startTime,
                    endTime: this.dadosHorario.endTime,
                    waitingServiceId: this.agendaConsulta.waitingServiceId
                }

                this.service.waiting(register, (response => {
                    this.isActive = false;
                    this.toastrService.success('Cadastrado com sucesso !!!');
                    this.limpaForm();
                    this.previousPage();
                }), (error) => {
                    this.isActive = false;
                    this.toastrService.danger(error.error.message);
                });
            } else {

                let params = new HttpParams();

                params = params.append('appointmentId', this.agendaConsulta.waitingServiceId)

                let register = {
                    dateService: moment(data.dataInicio).format('DD/MM/YYYY'),
                    startTime: this.dadosHorario.startTime,
                    endTime: this.dadosHorario.endTime,
                    meetingUrl: null,
                }

                this.service.waitingEdit(params, register, (response => {
                    this.isActive = false;
                    this.toastrService.success('Cadastrado com sucesso !!!');
                    //this.limpaForm();
                    //this.previousPage();
                }), (error) => {
                    this.isActive = false;
                    this.toastrService.danger(error.error.message);
                });

            }

        }
    }

    validaCampos(data) {

        if (data.medico == null) {
            this.toastrService.danger('O campo médico é obrigatório!!!');
            return false
        }
        if (data.tipoConsulta == null) {
            this.toastrService.danger('O campo tipo consulta é obrigatório!!!');
            return false
        }
        if (data.tipoEspecialidade == null) {
            this.toastrService.danger('O campo tipo especialidade é obrigatório!!!');
            return false
        }
        if (data.dataInicio == null) {
            this.toastrService.danger('A data início do período é obrigatória!!!');
            return false
        }
        if (data.consPagto == null) {
            this.toastrService.danger('O campo detalhes é obrigatória!!!');
            return false
        }
        if (data.formaPagto == null) {
            this.toastrService.danger('O tipo de pagamento é obrigatória!!!');
            return false
        }

        return true
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
                        horario: data.startTime.concat(' - ', data.endTime),
                        startTime: data.startTime,
                        endTime: data.endTime,
                        dateProposal: data.date
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

        this.tipoCard = [];
        this.dadosHorario = data;
        this.isHorario = false;
        this.isDadosAtendimento = true;

    }

    previousPage() {
        this.router.navigate(['/pages/atendimento/fila-espera'])
    }

}
