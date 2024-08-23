import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { AtendimentoService } from '../../atendimento/atendimento.service';
import * as moment from 'moment';
import { Chart } from 'chart.js';

@Component({
    selector: 'ngx-configurar-templates',
    styleUrls: ['./configurar-templates.scss'],
    templateUrl: './configurar-templates.html',
})
export class ConfigurarTemplatesComponent {


    public formFilaEspera = null;
    public listMedico = null;
    public isActive = false;
    public listTipoEspecialidade = null;
    public doctorId = null;
    public specialtyId = null;
    public listTipoConsulta = [];
    public rowData = [];
    public height: [45, 50, 55, 60, 65]; // Exemplo de percentis de altura
    public weight: [2.5, 3, 3.5, 4, 4.5]; // Exemplo de percentis de peso
    public chart: any;
    public percentiles :any;

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

        this.createChart('male',7);


        this.listMedico = JSON.parse(localStorage.getItem('bway-medico'));

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
      //  this.buscarEspecialidade();

        this.formFilaEspera = this.formBuilder.group({
            medico: [null],
            tipoConsulta: [null],
            tipoEspecialidade: [null],
        })

        //this.formFilaEspera.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });

    }

    calculateGrowth(ageInMonths, height, weight, gender) {
        // Lógica para calcular em qual percentil a criança se encontra
        const heightPercentiles = this.getPercentiles(this.percentiles[gender].height, height);
        const weightPercentiles = this.getPercentiles(this.percentiles[gender].weight, weight);
        return { heightPercentiles, weightPercentiles };
    }
    
    private getPercentiles(percentiles, value) {
        const result = {};
        const percentilKeys = [5, 25, 50, 75, 95];
        for (let i = 0; i < percentilKeys.length; i++) {
            const key = percentilKeys[i];
            result[key] = percentiles[key];
        }
        return result;
    }


    
    createChart(gender, currentAgeInMonths) {
        const totalMonths = 24; // Ajustado para 24 meses
        const height = 65; // Exemplo de altura em cm
        const weight = 12; // Exemplo de peso em kg
    
        const percentiles = {
            male: {
                height: {
                    5:  [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.5, 75.7, 76.9, 78.0, 79.1, 80.2, 81.2, 82.2, 83.2, 84.2, 85.1, 86.0, 86.9, 87.8],
                    25: [50.9, 55.7, 59.4, 62.4, 64.9, 66.9, 68.6, 70.2, 71.6, 73.0, 74.3, 75.5, 76.7, 77.9, 79.0, 80.1, 81.2, 82.2, 83.2, 84.2, 85.2, 86.1, 87.0, 87.9, 88.8],
                    50: [51.9, 56.7, 60.4, 63.4, 65.9, 67.9, 69.6, 71.2, 72.6, 74.0, 75.3, 76.5, 77.7, 78.9, 80.0, 81.1, 82.2, 83.2, 84.2, 85.2, 86.2, 87.1, 88.0, 88.9, 89.8],
                    75: [52.9, 57.7, 61.4, 64.4, 66.9, 68.9, 70.6, 72.2, 73.6, 75.0, 76.3, 77.5, 78.7, 79.9, 81.0, 82.1, 83.2, 84.2, 85.2, 86.2, 87.2, 88.1, 89.0, 89.9, 90.8],
                    95: [53.9, 58.7, 62.4, 65.4, 67.9, 69.9, 71.6, 73.2, 74.6, 76.0, 77.3, 78.5, 79.7, 80.9, 82.0, 83.1, 84.2, 85.2, 86.2, 87.2, 88.2, 89.1, 90.0, 90.9, 91.8]
                },
                weight: [8, 9, 10, 11, 12] // Exemplo de percentis de peso para meninos
            },
            female: {
                height: {
                    5: [49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.2, 68.6, 69.9, 71.1, 72.3, 73.4, 74.5, 75.6, 76.6, 77.6, 78.6, 79.5, 80.4, 81.3, 82.2, 83.0, 83.8, 84.6],
                    25: [50.1, 54.7, 58.1, 60.8, 63.1, 65.0, 66.7, 68.2, 69.6, 70.9, 72.1, 73.3, 74.4, 75.5, 76.6, 77.6, 78.6, 79.6, 80.5, 81.4, 82.3, 83.2, 84.0, 84.8, 85.6],
                    50: [51.1, 55.7, 59.1, 61.8, 64.1, 66.0, 67.7, 69.2, 70.6, 71.9, 73.1, 74.3, 75.4, 76.5, 77.6, 78.6, 79.6, 80.6, 81.5, 82.4, 83.3, 84.2, 85.0, 85.8, 86.6],
                    75: [52.1, 56.7, 60.1, 62.8, 65.1, 67.0, 68.7, 70.2, 71.6, 72.9, 74.1, 75.3, 76.4, 77.5, 78.6, 79.6, 80.6, 81.6, 82.5, 83.4, 84.3, 85.2, 86.0, 86.8, 87.6],
                    95: [53.1, 57.7, 61.1, 63.8, 66.1, 68.0, 69.7, 71.2, 72.6, 73.9, 75.1, 76.3, 77.4, 78.5, 79.6, 80.6, 81.6, 82.6, 83.5, 84.4, 85.3, 86.2, 87.0, 87.8, 88.6]
                },
                weight: [8, 9, 10, 11, 12] // Exemplo de percentis de peso para meninas
            }
        };
    
        this.percentiles = percentiles; // Adiciona os percentis ao objeto
    
        const growthData = this.calculateGrowth(currentAgeInMonths, height, weight, gender);
    
        this.chart = new Chart('canvas', {
            type: 'line',
            data: {
                labels: Array.from({ length: totalMonths }, (_, i) => i + 1),
                datasets: [
                    {
                        label: 'Percentil 5',
                        data: percentiles[gender].height[5],
                        borderColor: '#ff0000',
                        fill: false
                    },
                    {
                        label: 'Percentil 25',
                        data: percentiles[gender].height[25],
                        borderColor: '#ff8000',
                        fill: false
                    },
                    {
                        label: 'Percentil 50',
                        data: percentiles[gender].height[50],
                        borderColor: '#ffff00',
                        fill: false
                    },
                    {
                        label: 'Percentil 75',
                        data: percentiles[gender].height[75],
                        borderColor: '#80ff00',
                        fill: false
                    },
                    {
                        label: 'Percentil 95',
                        data: percentiles[gender].height[95],
                        borderColor: '#00ff00',
                        fill: false
                    },
                    {
                        label: 'Altura da Criança',
                        data: Array(totalMonths).fill(null).map((_, i) => (i === currentAgeInMonths - 1 ? height : null)),
                        borderColor: '#0000ff',
                        fill: false,
                        borderDash: [5, 5],
                        pointBackgroundColor: '#0000ff',
                        pointBorderColor: '#0000ff',
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Gráfico de Crescimento'
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Idade (meses)'
                        },
                        ticks: {
                            maxTicksLimit: 12 // Ajuste este valor conforme necessário
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Altura (cm)'
                        },
                        ticks: {
                            min: 49, // Defina o valor mínimo do eixo Y
                            max: 92, // Defina o valor máximo do eixo Y
                            stepSize: 15 // Ajuste este valor para aumentar o espaçamento entre os valores do eixo Y
                        }
                    }]
                }
            }
            
            
            
        });
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
