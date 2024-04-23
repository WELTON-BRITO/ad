import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { AtendimentoService } from '../atendimento.service';
import { CPFValidator } from '../../shared/validators/CPFValidator';
import * as moment from 'moment';

@Component({
    selector: 'ngx-bloquear-atendimento',
    styleUrls: ['./bloquear-atendimento.component.scss'],
    templateUrl: './bloquear-atendimento.component.html',
})
export class bloquearAtendimentoComponent {

    public formNovoAtendimento = null;
    public listMedico = null;
    public isActive = false;
    public specialtyId = null;
    public listTipoEspecialidade = null;

  
    public doctorId = null;
    public clinicId = null;
    public isConfAtendimento = false;

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private toastrService: NbToastrService,
        private service: AtendimentoService) {
    }

    ngOnInit() {

        this.listMedico = JSON.parse(localStorage.getItem('bway-medico'));
        
        if (this.listMedico && this.listMedico.length > 0) {
            this.verificaMedico(this.listMedico[0].id);
          } else {
            console.error('A lista de médicos está vazia ou não definida!');
           this.toastrService.warning('Sua Sessão foi Encerrada, Efetue um Novo Login','Aditi Care');
          
          {
                  setTimeout(() => {
                      this.router.navigate(['/login']);
                  }, 3000); // 3000 milissegundos = 3 segundos
              }
          }
        this.verificaEspecialidade(this.doctorId);
        this.formNovoAtendimento = this.formBuilder.group({
            medico: [this.listMedico[0]],
            dataAtendimento: null,
            horarioInicial: null,
            horarioFinal: null,
            idUser:1001,
            horarioSelected: null,
            tipoEspecialidade: [null],}
            )
        this.formNovoAtendimento.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });
    }

    limpaForm() {

        this.formNovoAtendimento = this.formBuilder.group({
            dataInicio: null,
            horarioInicial: null,
            horarioFinal: null,
            idUser:999,
        })

    }
    salvar(data) {

        const clinic = localStorage.getItem('bway-clinica');
        if (clinic) {
          const clinicObj = JSON.parse(clinic);
          this.clinicId = clinicObj[0].id;
        }


        let register = {

            doctorId: this.doctorId,
            clinicId: this.clinicId,
            userId: data.idUser,
            childId: null,
            dateService:data.dataAtendimento,
            startTime: data.horarioInicial,
            endTime: data.horarioFinal,
            healthPlanId: null,
            typePaymentId: 1,
            typeServiceId: 1,
            meetingUrl: null,
            specialtyId: data.tipoEspecialidade,
            paymentInCreation: null,
            isReturn: false,
            dontCheckAvailable: true,
            procedureId: null,

        }

        this.isActive = true;

        this.service.salvarAgendamento(register, (response => {
            this.isActive = false;
            this.toastrService.success('Realizado Bloqueio Com Sucesso','Aditi Care!');
            this.limpaForm();
            this.previousPage();
        }), (error) => {
            this.isActive = false;
            this.toastrService.danger(error);
        });
    }


    verificaMedico(data) {

        for (var i = 0; i < this.listMedico.length; i++) {

            if (data == this.listMedico[i].id) {
                this.doctorId = this.listMedico[i].id
            }
        }
    }

    previousPage() {
        this.router.navigate(['/pages/atendimento/buscar-atendimento'])
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
      
    pesquisarHorario(data) {
        this.isConfAtendimento = false;

        if (data.dataAtendimento == null ) {
            this.toastrService.warning('Por favor Informa a Data Desejada!');
        } 
        else if(data.horarioInicial == null || data.horarioFinal == null ){

            this.toastrService.warning('Por favor Informa o Horário do Bloqueio Desejado!');

        } else if(data.tipoEspecialidade == null ){

            this.toastrService.warning('Por favor Informe o tipo de Especialidade!');
        }
          else {

            this.isActive = true
            let params = new HttpParams();
            params = params.append('doctorId', data.medico)
            params = params.append('dateService', moment(data.dataAtendimento).format('YYYY-MM-DD'))
            params = params.append('startTime', data.horarioInicial)
            params = params.append('endTime', data.horarioFinal)

            this.service.timeAvailable(params, (response) => {
                this.isConfAtendimento = false;
                this.isActive = false
                if(response.value ==true){
                    this.isConfAtendimento = true;
                    this.toastrService.success(response.message);

                    // this.formNovoAtendimento.controls['horarioSelected'].setValue((data.dataInicio + " - " +this.dadosHorario.horaInicio + " - " + this.dadosHorario.horaFim ));
                }
                else{
                    this.isConfAtendimento = false;
                  this.toastrService.warning(response.message);
                }
            }, (error) => {
                this.toastrService.danger(error.message);
            });

        }
    }

}