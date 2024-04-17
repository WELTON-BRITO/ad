import { Component, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from '../../paciente/paciente.service';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
    selector: 'ngx-importar-historico',
    styleUrls: ['./importar-historico.component.scss'],
    templateUrl: './importar-historico.component.html',
})
export class ImportarHistoricoComponent implements OnInit {

    public history = null;
    public listMedico = null;
    public formBuscarAtendimento = null;
    public rowData = null;
    public isActive = false;
    public paciente = null;


    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private service: PacienteService,
        private toastrService: NbToastrService,
        private datePipe: DatePipe,
        private errorHandler: ErrorHandler) { }

    ngOnInit() {

        this.paciente = history.state;

        if (this.paciente.name !== null && this.paciente.name !== undefined) {
            // Se o nome não for nulo nem indefinido, execute o código aqui
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
        
            this.formBuscarAtendimento = this.formBuilder.group({
                cpf: [null],
                medico: [this.listMedico[0], Validators.required],
                nomePaciente: null,
            });
        
            this.formBuscarAtendimento.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });
        } else {
            // Se o nome for nulo ou indefinido, execute o código aqui
            this.previousPage();
        }

    }

    AssociarPaciente(data){

    this.isActive = true

    let newdata = {

        patientId:data.id,
        userId:   this.paciente.id,
        childId:  this.paciente.idChild
    }

    this.service.salvarImportacao(newdata, (response) => {

      this.isActive = false
      this.toastrService.success('Associação Realizada com Sucesso','Aditi Care!');
      this.previousPage();

    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);
    });
    }
    
    pesquisaGeral(data,checked){


        if(localStorage.getItem('importPaciente') ===null  || checked==true || localStorage.getItem('importPaciente') ===''){

            localStorage.removeItem('importPaciente'); //garante que o cache foi apagado das telas posteriores
      
          let params = new HttpParams();
      
          if(data.nomePaciente == null){
            this.toastrService.warning('O Nome do Paciente Deve ser Informado','Aditi Care');
          }else{
            params = params.append('name', data.nomePaciente)
          }
      
          if (data.medico != null) {
            params = params.append('doctorId', data.medico)
          }
          if (data.cpf != null) {
            params = params.append('document', data.cpf)
          }
      
          if ((data.cpf != null) || (data.medico != 'null')) {
      
            this.isActive = true;
            let allData = []; // Crie uma variável vazia para armazenar os dados
            this.service.buscaHistoricoPaciente(params, (response) => {
              allData = response
              .map(data => ({
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                phone:data.phone,
                email: data.email,
                dateBirth: this.numeroParaData(data.dateBirth).toLocaleDateString('pt-BR'),
                document: data.document,
                idDoctor: data.medico,
                process: data.process,
                              }));
      
        if (allData.length === 0) {
            this.toastrService.warning("Não Foram Encontradas Usuários", 'Aditi Care');
            this.saveData('importPaciente', null);
            this.isActive = false;
            this.rowData = null;
        } else {
            this.saveData('importPaciente', allData);
            this.isActive = false;
            this.rowData = allData;
        }

            }, (error) => {
              this.isActive = false;
              this.toastrService.danger(error.error.message);
            });
      
          } else {
            this.toastrService.warning('O campos médico ou CPF são obrigatórios!!!');
          }
      
        }else {
      
          const allData = localStorage.getItem('meuPaciente')
          
          if (allData) {
          // Converta os dados de string para objeto
          const parsedData = JSON.parse(allData);
          
          // Preencha os cards com os dados recuperados
          this.rowData = parsedData;
          }
          }
      
        }
      
         // Salva os dados no LocalStorage
         saveData(key: string, data: any): void {
          localStorage.setItem(key, JSON.stringify(data));
        }
      
        // Recupera os dados do LocalStorage
        getData(key: string): any {
          const storedData = localStorage.getItem(key);
          return storedData ? JSON.parse(storedData) : null;
        }

    previousPage() {
        this.router.navigate(['/pages/gestao-paciente/paciente'])
    }


    numeroParaData(numero: number): Date {
        const dataBase = new Date(1900, 0, 1); // 1º de janeiro de 1900
        const dataCalculada = new Date(dataBase.getTime() + (numero - 1) * 24 * 60 * 60 * 1000);
        return dataCalculada;
    }
    

}
