import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { AtendimentoService } from '../atendimento.service';
import * as moment from 'moment';

@Component({
    selector: 'ngx-reagendar-atendimento',
    styleUrls: ['./reagendar-atendimento.component.scss'],
    templateUrl: './reagendar-atendimento.component.html',
})
export class reagendarAtendimentoComponent {

    public formNovoAtendimento = null;
    public listMedico = null;
    public isActive = false;
    public specialtyId = null;
    public listTipoEspecialidade = null;
    public isLoader: boolean = false;
    public doctorId = null;
    public clinicId = null;
    public isConfAtendimento = false;

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private toastrService: NbToastrService,
        private service: AtendimentoService) {
    }

    ngOnInit() {

        let data = history.state

        if(data.id == null){
            this.previousPage();
        }

        this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));
        
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
            tipoEspecialidade: [null],
            idAppointment: data.id}
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
        this.fetchData(true)

        this.clinicId = localStorage.getItem('bway-entityId');

        let register = {

            dateService:data.dataAtendimento,
            startTime: data.horarioInicial,
            endTime: data.horarioFinal,
        }
        this.isActive = true;

        this.service.updateTimeAppointments(data.idAppointment,register, (response => {
            this.isActive = false;
            this.fetchData(false)

            this.toastrService.success('Realizado Reagendamento Com Sucesso','Aditi Care!');
            this.limpaForm();
            this.previousPage();
        }), (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message,'Aditi Care');
            this.fetchData(false)

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
        this.router.navigate(['/pages/atendimento/detalhe-atendimento'])
    }

    especialidade(data) {

        for (var i = 0; i < this.listTipoEspecialidade.length; i++) {

            if (data == this.listTipoEspecialidade[i].id) {
                this.specialtyId = this.listTipoEspecialidade[i].id
            }
        }
    }

    verificaEspecialidade(data) {
        
        this.fetchData(true)

        this.service.verificaEspecialidade(data, null, (response => {

            this.listTipoEspecialidade = response
            this.fetchData(false)

        }), (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message);
            this.fetchData(false)

        });

    }

    fetchData(data) {
        if(data){
        // Mostra o loader
        this.isLoader =true
        }else{
          setTimeout(() => {
            // Oculta o loader após o atraso
            this.isLoader =false
        }, 2000);
    }
    }
      
    pesquisarHorario(data) {
        this.isConfAtendimento = false;
        this.fetchData(true)

        if (data.dataAtendimento == null ) {
            this.toastrService.warning('Por favor Informa a Data Desejada!','Aditi Care');
            this.fetchData(false)
            return false
        } 
        else if(data.horarioInicial == null || data.horarioFinal == null ){

            this.toastrService.warning('Por favor Informa o Horário do Bloqueio Desejado!','Aditi Care');
            this.fetchData(false)
            return false

        } else if(data.tipoEspecialidade == null ){

            this.toastrService.warning('Por favor Informe o tipo de Especialidade!','Aditi Care');
            this.fetchData(false)
            return false
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
                this.fetchData(false)
                if(response.value ==true){
                    this.isConfAtendimento = true;
                    this.toastrService.success(response.message,'Aditi Care');

                    // this.formNovoAtendimento.controls['horarioSelected'].setValue((data.dataInicio + " - " +this.dadosHorario.horaInicio + " - " + this.dadosHorario.horaFim ));
                }
                else{
                    this.isConfAtendimento = false;
                  this.toastrService.warning(response.message,'Aditi Care');
                  this.fetchData(false)
                }
            }, (error) => {
                this.toastrService.danger(error.message,'Aditi Care');
                this.fetchData(false)

            });

        }
    }

}