import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { EncriptyUtilService } from '../../shared/services/encripty-util.services';
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
    private encriptyService: EncriptyUtilService,
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

    this.pesquisaMedico();

    this.formVisualizarDiaAtendimento = this.formBuilder.group({
      medico: [null],
    })

  }

  configAtendimento(data) {
    console.log(data)
    console.log(data.medico)
    //let name = this.encriptyService.encriptyBySecretKey(event)
   
    this.router.navigate(['/pages/configurar-agenda/configurar-dia-atendimento'], { queryParams: data.medico });
  }

  pesquisaMedico() {

    this.isActive = true

    this.service.buscaDoctor(null, (response) => {
      
      this.listMedico = response
      this.isActive = false

    }, (error) => {
      this.isActive = false
      this.toastrService.danger(error.error.message);
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
            nome: data.doctor.name.split(' ')[0],
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
      }else{
        this.isActive = false
        this.toastrService.warning('Não possui hora marcada !!!');
      }

    }, (error) => {
      this.toastrService.danger(error.error.message);
    });

  }

  /*pesquisar(data) {

    console.log(data)

    for (let item of this.cartData) {
      console.log(item)
      console.log(this.cartData)
      if (item.name == data.medico) {

        this.rowData = this.cartData.filter(teste => teste.id === item.id);
        this.source = new LocalDataSource(this.rowData);
        //this.teste1 = this.rowData
        //console.log(this.teste1)
      }
    }

  }*/

}
