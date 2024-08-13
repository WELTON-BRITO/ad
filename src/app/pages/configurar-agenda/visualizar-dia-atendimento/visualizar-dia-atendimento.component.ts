import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VisualizarDiaAtendimentoService } from './visualizar-dia-atendimento.service';
import { NbToastrService } from '@nebular/theme';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'ngx-visualizar-dia-atendimento',
  styleUrls: ['./visualizar-dia-atendimento.component.scss'],
  templateUrl: './visualizar-dia-atendimento.component.html',
})
export class VisualizarDiaAtendimentoComponent implements OnDestroy {

  public formVisualizarDiaAtendimento = null;
  public listMedico = null;
  public listSemana = null;
  public rowData: any = [];
  public cartData: any = [];
  public segunda = null;
  public terca = null;
  public quarta = null;
  public quinta = null;
  public sexta = null;
  public sabado = null;
  public domingo = null;
  public isActive = false;
  public listClinica: any = [];
  public clinicaId = null;
  public doctorId = null;
  public horariosPorDia: string[][] = [];
  public isLoader: boolean = false;


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: VisualizarDiaAtendimentoService,
    private toastrService: NbToastrService) {

    this.listSemana = [
      {
        semana: '1',
        descricao: 'Segunda'
      },
      {
        semana: '2',
        descricao: 'Terça'
      },
      {
        semana: '3',
        descricao: 'Quarta'
      },
      {
        semana: '4',
        descricao: 'Quinta'
      },
      {
        semana: '5',
        descricao: 'Sexta'
      },
      {
        semana: '6',
        descricao: 'Sabado'
      },
      {
        semana: '7',
        descricao: 'Domingo'
      }
    ]

  }
  ngOnDestroy() { }
  ngOnInit() {

    document.getElementById('bntConfig').setAttribute('disabled', 'true');
    this.listClinica = JSON.parse(localStorage.getItem('bway-clinica'));

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

    this.formVisualizarDiaAtendimento = this.formBuilder.group({
      medico: [this.listMedico[0], Validators.required],
      clinica: [this.listClinica[0], Validators.required],
    })

    this.formVisualizarDiaAtendimento.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });

    this.formVisualizarDiaAtendimento.controls['clinica'].setValue(this.listClinica[0].id, { onlySelf: true }); // use the id of the first clinica

   // this.verificaHorario(null)
  }

  configAtendimento(data) {
    this.verificaEspecialidade(data)
  }

  formatHorario(horario: string): string {
    // Suponha que o formato seja sempre "números - horário - descrição"
    const partes = horario.split(' - ');
    return partes[1] + ' - ' + partes[2] +  ' ' + partes.slice(3).join(' - ');
  }

  verificaHorario(data) {

   // this.isActive = true
    this.rowData = [];
    let params = new HttpParams();

    this.horariosPorDia= []   

    if (data && data.medico !== null) {
      params = params.append('doctorId', data.medico);
  } if (this.doctorId !== null){
    params = params.append('doctorId',this.doctorId);
  } 
  else {
      params = params.append('doctorId', this.formVisualizarDiaAtendimento.value.medico.id || this.listMedico[0].id);
  }

      if (this.clinicaId != null) {
      params = params.append('clinicId', data.clinica)
    }

    this.fetchData(true)

    this.service.agendaDoctor(params, (response: any[]) => {

      if (response.length !== 0) {
        this.rowData = response;
    
        this.rowData.forEach(data => {
          const diaSemana = data.weekday;
          const horario = `${data.id} - ${data.startTime} - ${data.endTime} - ${data.clinic.name} - ${data.typeService.description}`;
          
          // Verifica se o array não está vazio e se o horário não é vazio
          if (!this.horariosPorDia[diaSemana] && horario.trim() !== '') {
            this.horariosPorDia[diaSemana] = [];
          }
    
          // Adiciona o horário apenas se não for vazio
          if (horario.trim() !== '') {
            this.horariosPorDia[diaSemana].push(horario);
          }
        });
      
        // Remove a posição 0 do array
        this.horariosPorDia.shift();
    
        this.isActive = false;
        this.fetchData(false)

          }else{
            this.toastrService.danger('Este Médico Ainda não Possui Horários Cadastrados','Aditi Care');
            this.isActive = false
            this.fetchData(false)

          }
           
    }, (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message,'Aditi Care');
      this.fetchData(false)

    });
    
    document.getElementById('bntConfig').removeAttribute('disabled');

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

  // No seu componente TypeScript (por exemplo, agenda.component.ts)
getDiaSemana(diaSemana: number): string {
  switch (diaSemana) {
    case 0:
      return 'Segunda-feira';
    case 1:
      return 'Terça-feira';
    case 2:
      return 'Quarta-feira';
    case 3:
      return 'Quinta-feira';
    case 4:
      return 'Sexta-feira';
    case 5:
      return 'Sábado';
    case 6:
      return 'Domingo';
    default:
      return 'Dia não encontrado';
  }
}

deletarHorario(horario: string) {
  // Implemente a lógica para deletar o horário
  const partes = horario.split(' - ');

  var id =partes[0];

  this.fetchData(true)
  
  this.service.delete(id, (response => {
    this.isActive = false;
    this.toastrService.success('Horário Removido Com Sucesso','Aditi Care!');

    this.verificaHorario(null);
    this.fetchData(false)

  }), (error) => {

    if(error==='OK'){
    this.toastrService.success('Horário Removido Com Sucesso','Aditi Care!');
    this.fetchData(false)

  }else{
    this.toastrService.danger(error.message);
    this.fetchData(false)

  }

  });
  
}

  pesquisaClinica(data) {

    this.service.buscaClinica(data, null, (response) => {

      this.listClinica = response
      this.isActive = false

    }, (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);
    });

  }

  verificaClinica(data) {
    this.clinicaId = data;
  }

  buscarAtendimento(data) {
    this.verificaHorario(data)
  }

  verificaMedico(data) {

    for (var i = 0; i < this.listMedico.length; i++) {

      if (data == this.listMedico[i].id) {
        this.doctorId = this.listMedico[i].id
      }
    }
  }

  verificaEspecialidade(data) {

    this.fetchData(true)


    this.service.verificaEspecialidade(data.medico, null, (response => {
      if (response != null) {
        this.router.navigateByUrl('/pages/configurar-agenda/configurar-dia-atendimento', { state: data });
        this.fetchData(false)

      } else {
        this.toastrService.danger('O Médico Não Possui Especialidade Cadastrada, Realize o Cadastro');
        this.fetchData(false)

      }

    }), (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);
      this.fetchData(false)


    });

  }

}
