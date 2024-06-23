import { Component, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';

import * as moment from 'moment';
import { GestaoPacienteService } from '../gestao-paciente.service';

@Component({
    selector: 'ngx-historico',
    styleUrls: ['./historico.component.scss'],
    templateUrl: './historico.component.html',
})
export class HistoricoComponent implements OnInit {

    public history = null;
    public rowData = [];

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private toastrService: NbToastrService,
        private errorHandler: ErrorHandler,
        private service: GestaoPacienteService) { }

    ngOnInit() {

        this.history = history.state;
    }

    consultaHistorico() {

        var data = this.history;

        if(data.doctorId !==null){

            localStorage.removeItem('detalhesData'); //garante que o cache foi apagado das telas posteriores

            const dataNascimento = data.birthDateChild ?? data.birthDate ?? '20240101';
            const idadePessoa = this.calcularIdade(dataNascimento) ?? null;
         
            let allData = {
              medico: data.doctorId ?? null,
              nomePaciente: data.nameChild ?? data.name ?? null,
              nomeResponsavel: data.user?.name ?? null,
              data: moment(data.dateService).format('DD/MM/YYYY'),
              horario: (data.startTime ? data.startTime.concat(' - ', data.endTime) : data.endTime),
              formaPagamento: null,
              modalidade:  null,
              urlCall:null,
              status: null,
              especialidade:null,
              convenio: null,
              id: data.idChild ?? data.id ?? null,
              comprovante: null,
              nameFather: 'Sigiloso',
              nameMother: 'Sigiloso',
              telefone: data.cellPhone ?? null,
              email: data.email ?? null,
              dateNasc: idadePessoa ?? null,
              ultimaConsulta: dataNascimento ?? null,
              doctorId: data.doctorId ?? null,
              userId: data.id ?? null,
              idChild: data.idChild ?? null,
              sexo: data.biologicalSex === 'M' ? 'Masculino' : 'Feminino' ?? null,
              tipoSanguineo: 'Sigiloso',
              patchPaciente: true,
              findhistorico: true,
          };
                 
          this.saveData('detalhesData', allData);
    
    
          this.router.navigateByUrl('/pages/atendimento/consulta-paciente', { state: allData });
    

        }else{

            this.router.navigateByUrl('/pages/gestao-paciente/paciente', { state: this.rowData });


        }

       

    }

    importarHistorico() {
        this.router.navigateByUrl('/pages/gestao-paciente/importar-historico', { state: this.history });
    }

    previousPage() {
        this.router.navigate(['/pages/gestao-paciente/paciente'])
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
      
      calcularIdade(dataNascimento: string){
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
    
        const diff = hoje.getTime() - nascimento.getTime();
        const idade = new Date(diff);
    
        const anos = idade.getUTCFullYear() - 1970;
        const meses = idade.getUTCMonth();
        const dias = idade.getUTCDate() - 1;
    
        const dataCompleta = `Nasceu em ${nascimento.getFullYear()}, e Tem ${anos} anos ${meses} Meses e ${dias} Dias de Vida.`;
    
        return dataCompleta;
    }

}
