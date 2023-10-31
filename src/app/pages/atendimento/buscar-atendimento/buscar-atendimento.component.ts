import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { AtendimentoService } from "../atendimento.service";
import { NbToastrService } from "@nebular/theme";
import { HttpParams } from "@angular/common/http";
import * as moment from 'moment';
import { CPFValidator } from "../../shared/validators/CPFValidator";

@Component({
  selector: 'ngx-buscar-atendimento',
  styleUrls: ['./buscar-atendimento.component.scss'],
  templateUrl: './buscar-atendimento.component.html',
})
export class BuscarAtendimentoComponent implements OnInit {
  public doctorId = null;
  public formBuscarAtendimento = null;
  public listMedico = null;
  public isActive = false;
  public rowData = null;
  public showMsgErro = false;

  TodayDate = "2022-02-15";
  FinalDate = "2022-02-15";

  date1 = new Date();

  currentYear = this.date1.getUTCFullYear();
  currentMonth = this.date1.getUTCMonth() + 1;
  currentDay = this.date1.getUTCDate();
  currentDay2 = this.date1.getUTCDate() + 7;
  FinalMonth: any;
  FinalDay: any;

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
    private service: AtendimentoService,
    private toastrService: NbToastrService) {
  }

  get selectedCountry() {
    let countryId = this.formBuscarAtendimento.controls.medico.value;
    let selected = this.listMedico.find(medico => medico.id == countryId);
    return selected;
  }

  ngOnInit() {

    this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));

    if (this.currentMonth < 10) {
      this.FinalMonth = "0" + this.currentMonth;

    } else {
      this.FinalMonth = this.currentMonth;
    }

    if (this.currentDay < 10) {
      this.FinalDay = "0" + this.currentDay;

    } else {
      this.FinalDay = this.currentDay;
    }

    this.TodayDate = this.currentYear + "-" + this.FinalMonth + "-" + this.FinalDay;


    if (this.currentDay2 > 31) {
      this.FinalDay = 31;
    }

    this.FinalDate = this.currentYear + "-" + this.FinalMonth + "-" + this.FinalDay;


    var time = new Date(this.FinalDate);
    var outraData = new Date();
    outraData.setDate(time.getDate() + 7);
    this.FinalDate = moment(outraData).format('YYYY-MM-DD')

    this.formBuscarAtendimento = this.formBuilder.group({
      dataInicio: [this.TodayDate, Validators.required],
      dataFim: [this.FinalDate, Validators.required],
      nome: [null],
      medico: [this.listMedico[0], Validators.required],
      cpf: [null]
    });

    this.formBuscarAtendimento.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });

    var initData = [];
    this.rowData = initData;

    let register = {
      dataInicio: this.TodayDate,
      dataFim: this.FinalDate,
      medico: this.listMedico[0].id,
    }

    this.buscarAtendimento(register)

  }

  buscarAtendimento(data) {

    let params = new HttpParams();
    params = params.append('doctorId', data.medico)
    params = params.append('startDate', data.dataInicio)
    params = params.append('endDate', data.dataFim)
    if (data.nome != null) {
      params = params.append('name', data.nome)
    }
    if (data.cpf != null) {
      params = params.append('federalId', data.cpf)
    }
    this.isActive = true

    if (this.validaCampo(data)) {
      this.service.buscaAtendimentos(params, (response) => {
        this.isActive = false
        this.rowData = response
        this.rowData = this.rowData.map(data => {
          return {
            nome: data.child == null ? data.user.name : data.child.name,
            data: moment(data.dateService).format('DD/MM/YYYY'),
            horario: data.startTime.concat(' - ', data.endTime),
            especialidade: data.specialty.name,
            status: data.status,
            atendimento: data,
          }
        })

      }, (error) => {
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
    } else {
      this.isActive = false
    }

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

    if (data.dataInicio > data.dataFim) {
      this.toastrService.danger('A data início não pode ser maior que a data fim!!!');
      return false
    }
    var diff = Math.abs(new Date(data.dataFim).getTime() - new Date(data.dataInicio).getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24))
    if (diffDays > 15) {
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

  agendarAtendimento() {

    this.router.navigate(['/pages/atendimento/novo-atendimento']);

  }

  detalhes(data) {
    this.router.navigateByUrl('/pages/atendimento/detalhe-atendimento', { state: data.atendimento });
  }

  iniciarAtendimento(data) {
    this.router.navigateByUrl('/pages/atendimento/consulta-paciente', { state: data.atendimento });
  }

  videoAtendimento(url) {
    window.open(url.atendimento.meetingUrl, "_blank");
  }
}

