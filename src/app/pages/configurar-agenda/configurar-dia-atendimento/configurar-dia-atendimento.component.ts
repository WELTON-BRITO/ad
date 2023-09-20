import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { VisualizarDiaAtendimentoComponent } from '../visualizar-dia-atendimento/visualizar-dia-atendimento.component';
import { EncriptyUtilService } from '../../shared/services/encripty-util.services';

@Component({
  selector: 'ngx-configurar-dia-atendimento',
  styleUrls: ['./configurar-dia-atendimento.component.scss'],
  templateUrl: './configurar-dia-atendimento.component.html',
})
export class ConfigurarDiaAtendimentoComponent implements OnDestroy {

  public formDiaAtendimento = null;
  public nomeMedico = null;
  public rowData: any = [];

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
    columns: {
      Segunda: {
        title: 'Segunda',
        //type: 'name',
      },
      Terça: {
        title: 'Terça',
        type: 'date',
      },
      Quarta: {
        title: 'Quarta',
        type: 'hora',
      },
      Quinta: {
        title: 'Quinta',
        //type: 'name',
      },
      Sexta: {
        title: 'Sexta',
        //type: 'name',
      },
      Sabado: {
        title: 'Sabado',
        //type: 'name',
      },
      Domingo: {
        title: 'Domingo',
        //type: 'name',
      },
    },
  };


  public listMedico = null;
  public listSemana = null;
  public tipoCard: any[] = [{
    id: '',
    horaInicio: '',
    horaFim: ''
  }];
  public grupoCard = null;
  public card = null;

  source: LocalDataSource = new LocalDataSource();

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private _visualizarAtendimento: VisualizarDiaAtendimentoComponent,
    private encriptyService: EncriptyUtilService) {

    this.tipoCard = [];
    this.grupoCard = [];

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

    this.activatedRouter.queryParams.subscribe(register => {
      //this.nomeMedico = this.encriptyService.decriptyBySecretKey(register.medico) ;
      this.nomeMedico = register.medico;
    })
    console.log(this.nomeMedico)
    for (let item of this._visualizarAtendimento.cartData) {

      if (item.name == this.nomeMedico) {

        this.rowData = this._visualizarAtendimento.cartData.filter(idName => idName.id === item.id);
        this.source = new LocalDataSource(this.rowData);

      }
    } 

    this.formDiaAtendimento = this.formBuilder.group({
      semana: [null]
    })

  }


  onDeleteConfirm(event) {

    console.log(event.data)

    if (window.confirm('Tem certeza que deseja excluir?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event) {
    console.log('entei aqui para criar');
    console.log(event);
    //if (window.confirm('Are you sure you want to create?')) {
    event.confirm.resolve();
    //} else {
    // event.confirm.reject();
    //}

  }

  onSaveConfirm(event) {
    console.log('entei aqui para editar');
    console.log(event.data);
    event.confirm.resolve();
  }

  addHora() {

    this.tipoCard.push({
      id: this.tipoCard.length + 1,
      horaInicio: '',
      horaFim: ''
    })
  }

  removerCard() {

    this.tipoCard.splice(this.tipoCard.indexOf(3), 1);

  }

  salvar(event) {
    console.log(event)
    console.log(this.tipoCard)

    /*for (let i = 0; i < this.tipoCard.length; i++) {
 
       this.card = this.tipoCard[i]
       
     }
     
     console.log(this.card)*/

  }

  previousPage() {
    this.router.navigate(['/pages/configurar-agenda/visualizar-dia-atendimento'])
  }

}
