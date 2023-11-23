/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
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

    this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));

    this.formVisualizarDiaAtendimento = this.formBuilder.group({
      medico: [this.listMedico[0], Validators.required],
    })

    this.formVisualizarDiaAtendimento.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });
    this.verificaHorario(this.listMedico[0].id)

  }

  configAtendimento(data) {
    this.router.navigateByUrl('/pages/configurar-agenda/configurar-dia-atendimento', { state: data });
  }

  verificaHorario(data) {
    this.isActive = true
    this.rowData = [];

    let params = new HttpParams();
    params = params.append('doctorId', data)

    this.service.agendaDoctor(params, (response) => {

      if (response.length != 0) {

        this.rowData = response;

        this.rowData = this.rowData.map(data => {

          if (data.weekday == 1) {
            this.segunda = [data.startTime.concat(' - ', data.endTime)]
            this.terca = null;
            this.quarta = null;
            this.quinta = null;
            this.sexta = null;
            this.sabado = null;
            this.domingo = null;
          } else if (data.weekday == 2) {
            this.terca = [data.startTime.concat(' - ', data.endTime)]
            this.segunda = null;
            this.quarta = null;
            this.quinta = null;
            this.sexta = null;
            this.sabado = null;
            this.domingo = null;
          } else if (data.weekday == 3) {
            this.quarta = [data.startTime.concat(' - ', data.endTime)]
            this.segunda = null;
            this.terca = null;
            this.quinta = null;
            this.sexta = null;
            this.sabado = null;
            this.domingo = null;
          } else if (data.weekday == 4) {
            this.quinta = [data.startTime.concat(' - ', data.endTime)]
            this.segunda = null;
            this.terca = null;
            this.quarta = null;
            this.sexta = null;
            this.sabado = null;
            this.domingo = null;
          } else if (data.weekday == 5) {
            this.sexta = [data.startTime.concat(' - ', data.endTime)]
            this.segunda = null;
            this.terca = null;
            this.quarta = null;
            this.quinta = null;
            this.sabado = null;
            this.domingo = null;
          } else if (data.weekday == 6) {
            this.sabado = [data.startTime.concat(' - ', data.endTime)]
            this.segunda = null;
            this.terca = null;
            this.quarta = null;
            this.quinta = null;
            this.sexta = null;
            this.domingo = null;
          } else if (data.weekday == 7) {
            this.domingo = [data.startTime.concat(' - ', data.endTime)]
            this.segunda = null;
            this.terca = null;
            this.quarta = null;
            this.quinta = null;
            this.sexta = null;
            this.sabado = null;
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
      } else {
        this.isActive = false
        document.getElementById('bntConfig').removeAttribute('disabled');
        this.toastrService.warning('Não possui nenhum atendimento agendado.');
      }

    }, (error) => {
      this.toastrService.danger(error.error.message);
      document.getElementById('bntConfig').removeAttribute('disabled');
    });

  }

}
