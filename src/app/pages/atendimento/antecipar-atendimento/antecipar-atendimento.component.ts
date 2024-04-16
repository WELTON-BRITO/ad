import { Component, OnInit } from '@angular/core'; // Importe OnInit 
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { AtendimentoService } from "../atendimento.service";
import { NbToastrService } from "@nebular/theme";
import { HttpParams } from "@angular/common/http";
import * as moment from 'moment';
import { CPFValidator } from "../../shared/validators/CPFValidator";
import { LoaderService } from '../../shared/component/spinner/loarder/loader.service';


@Component({
  selector: 'ngx-antecipar-atendimento',
  styleUrls: ['./antecipar-atendimento.component.scss'],
  templateUrl: './antecipar-atendimento.component.html',
})

export class AnteciparAtendimentoComponent implements OnInit {
  public doctorId = null;
  public formBuscarAtendimento = null;
  public listMedico = null;
  public isActive = false;
  public rowData = null;
  public showMsgErro = false;
  public tipo = null;
  public listClinica = null;
  public listTipoConsulta = [];
  public tipoConsulta = [];
  public DefaultStatus = '7,10,4,8';
  public checked = false;
  diaAnterior: string | null = null; // Inicialmente, não há dia anterior
  public tipoCard = [];
  public isBlock: boolean = true;
  TodayDate = "2022-02-15";
  FinalDate = "2022-02-15";
  date1 = new Date();
  currentYear = this.date1.getUTCFullYear();
  currentMonth = this.date1.getUTCMonth() + 1;
  currentDay = this.date1.getUTCDate();
  currentDay2 = this.date1.getUTCDate() + 7;
  FinalMonth: any;
  FinalDay: any;
  public isLoader: boolean = false;
  public avatar = "assets/images/avatar.png";


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
    private toastrService: NbToastrService,
    private loader: LoaderService,
    ) {


  }

  get selectedCountry() {
    let countryId = this.formBuscarAtendimento.controls.medico.value;
    let selected = this.listMedico.find(medico => medico.id == countryId);
    return selected;
  }

  ngOnInit() {

    this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));
    this.listClinica = JSON.parse(sessionStorage.getItem('bway-clinica'));

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
      medico: [this.listMedico[0], Validators.required],
      clinica: [this.listClinica[0], Validators.required],
    });


    this.formBuscarAtendimento.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });
    this.formBuscarAtendimento.controls['clinica'].setValue(this.listClinica[0].id, { onlySelf: true }); // use the id of the first clinica

    var initData = [];
    this.rowData = initData;

    let register = {
      medico: this.listMedico[0].id,
      clinicaId: this.listClinica[0].id,
    }
      this.buscarAntecipacoes(register)
  }


  buscarAntecipacoes(data) {

     this.fetchData(true)
     this.isActive = true;

      this.isActive = true
      let params = new HttpParams();

      params = params.append('clinicId', data.clinicaId ?? data.clinica ?? 1);
      params = params.append('doctorId', data.medicoId ?? data.medico);

      let allData = []; // Crie uma variável vazia para armazenar os dados
          this.service.buscaAntecipacoes(params, (response) => {
            allData = response
              .map(data => ({
                id: data.id,
                medico: data.doctorName,
                nomeDependente: data?.childName,
                nomeResponsavel: data.userName,
                data: moment(data.dateService).format('DD/MM/YYYY'),
                horario: data.startTime.concat(' - ', data.endTime),
                especialidade: data.specialtyName,
                status: data.status,
                atendimento: data,
                modalidade: data.typeServiceName + ' - ' + (data?.procedureName ?? ''),
                email: data.userEmail,
                telefone: data.userPhone,
                dataInicio: data.dataInicio,
                dataFim: data.dataInicio,
                clinicaId: data.clinicId,
                statusId: this.DefaultStatus,
                medicoId: data.doctorId,
                isConfirmed: data.isConfirmed ? 'Confirmado' : 'Não Confirmado',
                avatar: this.getAvatar(data)
              }));

            if (allData.length === 0) {
              this.toastrService.warning("Não Foram Encontradas Solicitações de Antecipações Para Este Médico.", 'Aditi Care');
             
              this.isActive = false;
              this.rowData = null;
            } else {
              this.isActive = false;
              this.rowData = allData;
            }
            this.fetchData(false)

          }, (error) => {
            this.isActive = false;
            this.toastrService.danger(error?.message || "Erro desconhecido.",'Aditi Care');
            this.fetchData(false)
          }); 

  }

  getAvatar(data) {
    if (data.childAvatar || data.userAvatar) {
      return `data:image/png;base64,${data.childAvatar ?? data.userAvatar}`;
    } else {
      // Retorna o caminho para a imagem padrão
      return this.avatar
    }
  }

  editarConsulta(data) {
    console.log(data)
    this.router.navigateByUrl('/pages/atendimento/reagendar-atendimento', { state:  data });
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
  // Salva os dados no LocalStorage
  saveData(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Recupera os dados do LocalStorage
  getData(key: string): any {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  }

  
}

