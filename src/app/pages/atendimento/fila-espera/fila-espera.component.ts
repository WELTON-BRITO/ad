import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { AtendimentoService } from '../atendimento.service';
import { CPFValidator } from '../../shared/validators/CPFValidator';
import * as moment from 'moment';

@Component({
    selector: 'ngx-fila-espera',
    styleUrls: ['./fila-espera.component.scss'],
    templateUrl: './fila-espera.component.html',
})
export class FilaEsperaComponent {

    public formFilaEspera = null;
    public listMedico = null;
    public isActive = false;
    public listTipoEspecialidade = null;
    public doctorId = null;
    public specialtyId = null;
    public listTipoConsulta = [];
    public rowData = [];

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

        if (this.listMedico && this.listMedico.length > 0) {
          } else {
            console.error('A lista de médicos está vazia ou não definida!');
           this.toastrService.warning('Sua Sessão foi Encerrada, Efetue um Novo Login','Aditi Care');
          
          {
                  setTimeout(() => {
                      this.router.navigate(['/login']);
                  }, 3000); // 3000 milissegundos = 3 segundos
              }
          }

        //this.verificaMedico(this.listMedico[0].id);
        this.buscarEspecialidade();

        this.formFilaEspera = this.formBuilder.group({
            medico: [null],
            tipoConsulta: [null],
            tipoEspecialidade: [null],
        })

        //this.formFilaEspera.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });

    }


    limpaForm() {

        this.formFilaEspera = this.formBuilder.group({
            medico: [null],
            tipoConsulta: [null],
            tipoEspecialidade: [null],
        })

    }

    verificaMedico(data) {

        this.isActive = true
        this.rowData = [];
        for (var i = 0; i < this.listMedico.length; i++) {

            if (data == this.listMedico[i].id) {
                this.doctorId = this.listMedico[i].id
                this.isActive = false;
            }
        }

        this.verificaEspecialidade(this.doctorId);
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

    buscarEspecialidade() {

        this.service.buscaSpecialty(null, (response => {

            this.listTipoEspecialidade = response

        }), (error) => {

            this.toastrService.danger(error.error.message);

        });

    }

    pesquisarProposta(data) {

        if (this.validaCampo(data)) {

            this.isActive = true
            let params = new HttpParams();
            params = params.append('specialtyId', data.tipoEspecialidade)
            params = params.append('statusId', '14')

            this.service.waitingService(params, (response) => {

                this.isActive = false;
                this.rowData = response;

                if (response.length > 0) {

                    this.rowData = this.rowData.map(data => {
                        return {
                            id: data.id,
                            name: data.child == null ? data.user.name : data.child.name,
                            cellPhone: data.user.cellPhone,
                            email: data.user.emailUser,
                            dataSolicitacao: moment(data.dateDesired).format('DD/MM/YYYY'),
                            observacao: data.description,
                            nameMae: data.user.name,
                            cpfMae: data.user.federalId,
                            idMae: data.user.id,
                            cpfDependente: data.child == null ? null : data.child.cpf,
                            idDependente: data.child == null ? null : data.child.idChild,
                        }
                    })
                } else {
                    this.toastrService.danger('Não existe proposta de atendimento para essa especialidade.');
                }

            }, (error) => {
                this.isActive = false;
                this.toastrService.danger(error.error.message);
            });
        }
    }

    validaCampo(data) {

        if ((data.tipoEspecialidade === null) || (data.tipoEspecialidade === "null")) {
            this.toastrService.danger('O campo tipo especialidade é obrigatório!!!');
            this.rowData = [];
            return false
        }

        return true
    }

    visualizar(data) {
        this.router.navigateByUrl('/pages/atendimento/agendar-consulta', { state: data });
    }

}
