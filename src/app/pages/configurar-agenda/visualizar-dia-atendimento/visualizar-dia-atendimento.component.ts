import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  public isActive = true;

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

    var name = localStorage.getItem('bway-domain');
    var id = localStorage.getItem('bway-entityId');   
    
    if(name == 'CLINIC'){
      this.pesquisaClinica(id)
    }else{
      this.pesquisaMedico(id);
    }

    this.formVisualizarDiaAtendimento = this.formBuilder.group({
      medico: [null],
    })

  }

  configAtendimento(data) {
  
    this.router.navigate(['/pages/configurar-agenda/configurar-dia-atendimento/'], { queryParams: data });
  }

  pesquisaMedico(data) {

    this.isActive = true

    let params = new HttpParams();
    params = params.append('doctorId', data)

    this.service.buscaDoctor(params, (response) => {

      this.listMedico = response
      this.isActive = false

    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);
    });    

  }
 
 pesquisaClinica(data) {
    this.isActive = true   
    this.service.buscaClinica(data, null, (response) => {

      this.listMedico = response
      this.isActive = false

    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);
    });

  }

  verificaHorario(data) {
    this.isActive = true
    this.rowData = [];
    
    let params = new HttpParams();
    params = params.append('doctorId', data)

    this.service.agendaDoctor(params, (response) => {

      if(response.length != 0){        
        
        this.rowData = response;

        this.rowData = this.rowData.map(data => {

          if (data.weekday == 1) {
            this.segunda = [data.startTime.concat(' - ', data.endTime)]
          } else if (data.weekday == 2) {
            this.terca = [data.startTime.concat(' - ', data.endTime)]
          } else if (data.weekday == 3) {
            this.quarta = [data.startTime.concat(' - ', data.endTime)]
          } else if (data.weekday == 4) {
            this.quinta = [data.startTime.concat(' - ', data.endTime)]
          } else if (data.weekday == 5) {
            this.sexta = [data.startTime.concat(' - ', data.endTime)]
          } else if (data.weekday == 6) {
            this.sabado = [data.startTime.concat(' - ', data.endTime)]
          } else if (data.weekday == 7) {
            this.domingo = [data.startTime.concat(' - ', data.endTime)]
          }
  
          return {           
            segunda: this.segunda,
            terca: this.terca,
            quarta: this.quarta,
            quinta: this.quinta,
            sexta: this.sexta,
            sabado: this.sabado,
            domingo: this.domingo,
          }
        })
        this.isActive = false
        document.getElementById('bntConfig').removeAttribute('disabled');
      }else{
        this.isActive = false
        this.toastrService.warning('Não possui hora marcada !!!');
        document.getElementById('bntConfig').removeAttribute('disabled');
      }

    }, (message) => {
      this.toastrService.danger(message);
      document.getElementById('bntConfig').removeAttribute('disabled');
    });

  }
 
}
