import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { AtendimentoService } from "../atendimento.service";
import { EncriptyUtilService } from "../../shared/services/encripty-util.services";
import { NbToastrService } from "@nebular/theme";
import { HttpParams } from "@angular/common/http";
import * as moment from 'moment';
import { CPFValidator } from "../../shared/validators/CPFValidator";

@Component({
  selector: 'ngx-buscar-atendimento',
  styleUrls: ['./buscar-atendimento.component.scss'],
  templateUrl: './buscar-atendimento.component.html',
})
export class BuscarAtendimentoComponent implements OnInit
 {
  public doctorId = null;
  public formBuscarAtendimento = null;
  public listMedico = null;
  public isActive = true;
  public rowData = null;
  public showMsgErro = false;


  settings = {
    //actions: false,
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: true,
    hideSubHeader: true,
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,

    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
  };

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private service: AtendimentoService,
    private encriptyService: EncriptyUtilService,
    private toastrService: NbToastrService) {
    }

  ngOnInit() {

    this.formBuscarAtendimento = this.formBuilder.group({
      dataInicio: [null, Validators.required],
      dataFim:  [null, Validators.required],
      nome: [null],
      medico: [null, Validators.required],
      cpf: [null],
    })

    var initData = [
      {
        nome: "paciente 1",
        data: moment('2023-10-11').format('DD/MM/YYYY'),
        horario: '15:00 - 16:00',
        especialidade: 'Pediatra',
        status: 'status'
      },
      {
        nome: "paciente 2",
        data: moment('2023-10-11').format('DD/MM/YYYY'),
        horario: '16:00 - 17:00',
        especialidade: 'Pediatra',
        status: 'status'
      },
      {
        nome: "paciente 3",
        data: moment('2023-10-11').format('DD/MM/YYYY'),
        horario: '17:00 - 18:00',
        especialidade: 'Pediatra',
        status: 'status'
      }
    ]
    this.rowData = initData;
    var name = localStorage.getItem('bway-domain');
    var id = localStorage.getItem('bway-entityId');

    if(name == 'CLINIC'){
      this.pesquisaMedico(null)
    }else{
      this.pesquisaMedico(id);
    }
  }

  buscarAtendimento(data){   

    let params = new HttpParams();
    params =  params.append('doctorId', data.medico)
    params =  params.append('startDate', data.dataInicio)
    params =  params.append('endDate', data.dataFim)
    if(data.nome != null){
      params =   params.append('name', data.nome)
    }
    if(data.cpf != null){
      params =   params.append('federalId', data.cpf)
    }
    this.isActive = true

    if(this.validaCampo(data)){
      this.service.buscaAtendimentos(params, (response) => {
        this.isActive = false
        this.rowData = response
        console.log(this.rowData)
        this.rowData = this.rowData.map(data => {
          return {
            nome: data.child == null ? data.user.name : data.child.name,
            data:  moment(data.dateService).format('DD/MM/YYYY'),
            horario: data.startTime.concat(' - ', data.endTime),
            especialidade: data.specialty.name,
            status: data.status,
            atendimento: data,
          }
        })

      }, (error) => {
        console.log(error)
        this.isActive = false;
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        this.toastrService.danger(error.error.message);

      });
    }else {
      this.isActive = false
    }
    
  }

  pesquisaMedico(data) {

    this.isActive = true

    let params = new HttpParams();
    if(data != null){
      params = params.append('doctorId', data)
    }


    this.service.buscaDoctor(params, (response) => {

      this.listMedico = response
      this.isActive = false

    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);
    });

  }

  validaCampo(data) {

    if (data.medico == null) {
      this.toastrService.danger('O campo médico é obrigatório!!!');
      return false
    }
    if (data.dataInicio == null) {
      this.toastrService.danger('A data início do período é obrigatória!!!');
      return false
    }
    if (data.dataFim == null) {
      this.toastrService.danger('A data fim do período é obrigatória!!!');
      return false
    }

    if(data.dataInicio > data.dataFim){
      this.toastrService.danger('A data início não pode ser maior que a data fim!!!');
      return false
    }
    var diff = Math.abs(new Date(data.dataFim).getTime() - new Date(data.dataInicio).getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24))
    if( diffDays > 15){
      this.toastrService.danger('O período de datas deve ser menor ou igual a 15 dias!!!');
      return false
    }
    return true
  }

  isValidCpf(data) {

    if (!CPFValidator.isValidCPF(data.cpf)) {
      this.showMsgErro = true;
      return false;
    }
    this.showMsgErro = false;
    return true;
  }

  agendarAtendimento(){

    this.router.navigate(['/pages/atendimento/novo-atendimento']);

  }

  detalhes(data) {
    this.router.navigateByUrl('/pages/atendimento/detalhe-atendimento', { state: data.atendimento });
  }
 }

