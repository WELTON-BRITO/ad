import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalAgendaPacienteService } from './modal-agenda-paciente.service';

@Component({
  selector: 'ngx-modal-agenda-paciente',
  templateUrl: './modal-agenda-paciente.component.html',
  styleUrls: ['./modal-agenda-paciente.component.scss']
})
export class ModalAgendaPacienteComponent implements OnInit {

  @Input() razaoSocial: string;
  @Input() cnpjCpf: string;
  @Input() cadastrar: string;
  @Input() editar: string; 

  private card: ElementRef;
  public formAgendaPaciente = null;
  public tipo = null;
  public percentualParceiro = null;
  public percentualEmpresa = null;
  public modalEdit = false;
  public modalCadastrar = false;
  public tipoDado = null;
  public status = null;
  public page = null;
  public tableLimit = "20";
  public customLogin = null;


  constructor(
    private formBuilder: FormBuilder,
    protected ref: NbDialogRef<ModalAgendaPacienteComponent>,
    private service: ModalAgendaPacienteService,
  ) {

    this.tipo = [
      {
        status: 'ATIVO',
        descricao: 'ATIVO'
      },
      {
        status: 'INATIVO',
        descricao: 'INATIVO'
      },
      {
        status: 'SUSPENSO',
        descricao: 'SUSPENSO'
      },

    ];

    this.formAgendaPaciente = this.formBuilder.group({
      razaoSocial: [null],
      cnpjCpf: [null],
      percentualEmpresa: [null],
      percentualParceiro: [null],
      status: [null],
      nomeFantasia: [null]
    });

  }

  close() {
    this.ref.close();
  }


  ngOnInit() {  }


}
