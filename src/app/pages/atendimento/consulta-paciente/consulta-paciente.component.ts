import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { AtendimentoService } from '../atendimento.service';
import * as moment from 'moment';
import { Observable, Subscriber } from 'rxjs';

declare var $: any;
@Component({
    selector: 'ngx-consulta-paciente',
    styleUrls: ['./consulta-paciente.component.scss'],
    templateUrl: './consulta-paciente.component.html',
})

export class ConsultaPacienteComponent implements OnDestroy {


    @ViewChild("inputFileReceita",)
    private inputFileReceita: ElementRef;

    @ViewChild("inputFileAtestado",)
    private inputFileAtestado: ElementRef;

    public formConsultaPaciente = null;
    public isActive = false;
    public isDetalhes = false;
    public isHistorico = false;
    public isAtestado = false;
    public isReceita = false;
    public tamInterno: number = 20000;
    public tamCliente: number = 20000;
    public tamMedica: number = 20000;
    public tamExame: number = 20000;
    public file: any;
    formData: FormData;
    public atendimento = {
        id: null,
        doctorId: null,
        nome: null,
        dateNasc: null,
        sexo: null,
        especialidade: null,
        tipoSanguineo: null,
        ultimaConsulta: null,
        userId: null,
        idChild: null,
        status: null
    };
    public anexoAtestado = null;
    public anexoReceita = null;
    public rowData = null;
    public endDate = new Date()
    public startDate = new Date((new Date().valueOf() - 1000 * 60 * 60 * 2200))

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private toastrService: NbToastrService,
        private service: AtendimentoService) {
    }

    ngOnDestroy() { }
    ngOnInit() {

        let data = history.state;

        if (data[0].tela == 'historico') {
            this.atendimento.nome = data[0].rowData[0].user.name;
            this.atendimento.especialidade = data[0].rowData[0].specialty.name;
            this.atendimento.dateNasc = moment(data[0].rowData[0].user.birthDate).format('DD/MM/YYYY');
            this.atendimento.ultimaConsulta = moment(data[0].rowData[0].user.dateRegister).format('DD/MM/YYYY');
            this.atendimento.doctorId = data[0].rowData[0].doctor.id;
            this.atendimento.userId = data[0].rowData[0].user.id
            this.atendimento.idChild = data[0].rowData[0].child != null ? data[0].rowData[0].idChild : '';
            this.consultaHistorico();
        } else {
            this.atendimento.id = data[0].rowData.id;
            this.atendimento.doctorId = data[0].rowData.doctor.id;
            this.atendimento.idChild = data[0].rowData.child != null ? data[0].rowData.child.idChild : '';
            this.atendimento.userId = data[0].rowData.user != null ? data[0].rowData.user.id : '';
            this.atendimento.nome = data[0].rowData.child != null ? data[0].rowData.child.name : data[0].rowData.user.name;
            this.atendimento.dateNasc = data[0].rowData.child != null ? moment(data[0].rowData.child.birthDate).format('DD/MM/YYYY') : moment(data[0].rowData.user.birthDate).format('DD/MM/YYYY');
            this.atendimento.sexo = data[0].rowData.child != null ? data[0].rowData.child.biologicalSex == 'M' ? "Masculino" : "Feminino" : null;
            this.atendimento.especialidade = data[0].rowData.specialty.name;
            this.atendimento.tipoSanguineo = data[0].rowData.child != null ? data[0].rowData.child.bloodType : null;
            this.atendimento.ultimaConsulta = data[0].rowData.child != null ? moment(data[0].rowData.child.dateRegister).format('DD/MM/YYYY') : moment(data[0].rowData.user.dateRegister).format('DD/MM/YYYY');
            this.atendimento.status = data[0].rowData.status
        }


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
            nome: [null],
            atestado: [null],
            receita: [null],
            prescricaoMedica: [null],
            pedidoExame: [null],
            urlExame: [null]
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
            nome: [null],
            atestado: [null],
            receita: [null],
            prescricaoMedica: [null],
            pedidoExame: [null],
            urlExame: [null]
        })
        this.tamMedica = 20000;
        this.tamInterno = 20000;
        this.tamCliente = 20000;
        this.tamExame = 20000;
    }

    detalhesConsulta() {
        this.isDetalhes = true;
        this.isHistorico = false;
        this.isAtestado = true;
        this.isReceita = true;

        setTimeout(() => {
            document.getElementById('tempoRetorno').removeAttribute('disabled');
            document.getElementById('altura').removeAttribute('disabled');
            document.getElementById('peso').removeAttribute('disabled');
            document.getElementById('circCabeca').removeAttribute('disabled');
            document.getElementById('circAbdomen').removeAttribute('disabled');
            document.getElementById('urlReceita').removeAttribute('disabled');
            document.getElementById('urlAtestado').removeAttribute('disabled');
            document.getElementById('prescricaoMedica').removeAttribute('disabled');
            document.getElementById('detalhesInterno').removeAttribute('disabled');
            document.getElementById('detalhesCliente').removeAttribute('disabled');
            document.getElementById('urlExame').removeAttribute('disabled');
            document.getElementById('pedidoExame').removeAttribute('disabled');
        }, 10)

    }

    consultaHistorico() {
        this.isDetalhes = false;
        this.isHistorico = true;
        this.isAtestado = false;
        this.isReceita = false;

        let date = new Date(this.endDate)
        date.setDate(date.getDate() + 1)

        let params = new HttpParams();
        params = params.append('doctorId', this.atendimento.doctorId)
        params = params.append('userId', this.atendimento.userId)
        params = params.append('childId', this.atendimento.idChild)
        params = params.append('startDate', moment(this.startDate).format('YYYY/MM/DD'))
        params = params.append('endDate', moment(date).format('YYYY/MM/DD'))

        this.isActive = true

        this.service.buscaAtendimentos(params, (response) => {

            this.isActive = false
            this.rowData = response
            this.rowData = this.rowData.map(data => {
                return {
                    name: data.doctor.name,
                    cpf: data.user.federalId,
                    birthDate: moment(data.dateService).format('DD/MM/YYYY'),
                    id: data.id
                }
            })

        }, (error) => {
            this.isActive = false;
            if (error.error instanceof ErrorEvent) {
                console.error('An error occurred:', error.error.message);
            } else {
                console.error(
                    `Backend returned code ${error.status}, ` +
                    `body was: ${error.error}`);
            }
            this.toastrService.danger(error.error.message);

        });

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

    caracteresMedica() {

        let inpuBox = document.querySelector(".input-medica"),
            textArea = inpuBox.querySelector("textarea");
        var caracteresRestantes = this.tamMedica;

        textArea.addEventListener("keyup", () => {

            let valLenght = textArea.value.length;
            this.tamMedica = caracteresRestantes - valLenght;
            valLenght < 30
                ? inpuBox.classList.add("error")
                : inpuBox.classList.remove("error");

        });
    }

    caracteresExame() {

        let inpuBox = document.querySelector(".input-exame"),
            textArea = inpuBox.querySelector("textarea");
        var caracteresRestantes = this.tamExame;

        textArea.addEventListener("keyup", () => {

            let valLenght = textArea.value.length;
            this.tamExame = caracteresRestantes - valLenght;
            valLenght < 30
                ? inpuBox.classList.add("error")
                : inpuBox.classList.remove("error");

        });
    }


    voltar() {
        this.isDetalhes = false;
        this.isHistorico = false;
        this.limpaForm();
    }

    public onUploadAtestado = ($event: Event, element) => {

        const target = $event.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];
        this.inputFileAtestado.nativeElement.innerText = file.name;

        this.convertToAtestado(file, element);
    }

    public convertToAtestado(file: File, element) {

        const observable = new Observable((subscriber: Subscriber<any>) => {
            this.readFile(file, subscriber)
        })

        observable.subscribe((d: String) => {
            this.anexoAtestado = d.slice(d.indexOf(",") + 1);
        })

    }

    public onUploadReceita = ($event: Event, element) => {

        const target = $event.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];
        this.inputFileReceita.nativeElement.innerText = file.name;

        this.convertToReceita(file, element);
    }

    public convertToReceita(file: File, element) {

        const observable = new Observable((subscriber: Subscriber<any>) => {
            this.readFile(file, subscriber)
        })

        observable.subscribe((d: String) => {

            this.anexoReceita = d.slice(d.indexOf(",") + 1);
        })

    }

    public readFile(file: File, subscribe: Subscriber<any>) {
        const filereader = new FileReader();

        filereader.readAsDataURL(file)
        filereader.onload = () => {
            subscribe.next(filereader.result);
            subscribe.complete()
        }
        filereader.onerror = () => {
            subscribe.error()
            subscribe.complete()
        }
    }

    salvar(data) {

        let register = {
            serviceId: this.atendimento.id,  // id da consulta da buscar-atendimento
            description: null,
            prescription: data.prescricaoMedica,  //Prescrição campo novo que vira da tela detalhes
            urlPrescription: data.urlReceita,
            timeReturn: data.tempoRetorno,
            removalReport: null,
            urlRemovalReport: data.urlAtestado,
            prescriptionAttachment: this.anexoAtestado, //anexo mandar igual o da imagem
            removalAttachment: this.anexoReceita, // anexo
            height: data.altura,
            weight: data.peso,
            headSize: data.circCabeca,
            abdomenSize: data.circAbdomen,
            descriptionClinic: data.detalhesInterno,
            descriptionUser: data.detalhesCliente,
            urlMedicalOrder: data.urlExame,
            descriptionMedicalOrder: data.pedidoExame,
        }

        this.isActive = true;
        this.service.salvarDetalheAtendimento(register, (response => {
            this.isActive = false;
            this.toastrService.success('Cadastrado com sucesso !!!');
            this.limpaForm();
            this.voltar();
        }), (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message);

        });
    }

    visualizar(data) {

        this.isActive = true
        let params = new HttpParams();
        params = params.append('appointmentId', data.id)

        this.service.visualizarHistorico(params, (response) => {

            this.isActive = false;
            this.isDetalhes = true;
            this.isHistorico = false;
            this.formConsultaPaciente.controls['detalhesCliente'].setValue(response.descriptionClinic);
            this.formConsultaPaciente.controls['detalhesInterno'].setValue(response.description);
            this.formConsultaPaciente.controls['tempoRetorno'].setValue(response.timeReturn);
            this.formConsultaPaciente.controls['altura'].setValue(response.height);
            this.formConsultaPaciente.controls['peso'].setValue(response.weight);
            this.formConsultaPaciente.controls['circCabeca'].setValue(response.headSize);
            this.formConsultaPaciente.controls['circAbdomen'].setValue(response.abdomenSize);
            this.formConsultaPaciente.controls['urlReceita'].setValue(response.urlPrescription);
            this.formConsultaPaciente.controls['urlAtestado'].setValue(response.urlRemovalReport);
            this.formConsultaPaciente.controls['prescricaoMedica'].setValue(response.prescription);
            this.formConsultaPaciente.controls['pedidoExame'].setValue(response.descriptionMedicalOrder);
            this.formConsultaPaciente.controls['urlExame'].setValue(response.urlMedicalOrder);

        }, (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message);
        });

    }

    number(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;

        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    previousPage() {
        this.router.navigate(['/pages/atendimento/buscar-atendimento'])
    }

}
