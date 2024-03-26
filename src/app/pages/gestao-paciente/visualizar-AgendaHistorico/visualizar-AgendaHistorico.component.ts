import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Observable, Subscriber } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { AtendimentoService } from '../../atendimento/atendimento.service';
import * as moment from 'moment';


@Component({
  selector: 'ngx-dependente',
  styleUrls: ['./visualizar-AgendaHistorico.component.scss'],
  templateUrl: './visualizar-AgendaHistorico.html',
})
export class AgendaPacienteComponent implements OnDestroy {

  public formDependente = null;


  public doctorId = null;
  public history = null;
  public rowData2 = [];
  public rowData = [];
  public name = null;
  public id= null;
  public idChild = null;
  public isActive = false;
  public startDate = new Date();
  public avatar = "assets/images/avatar.png";




  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: AtendimentoService,
    private toastrService: NbToastrService) {

  }
  ngOnDestroy() { }

  ngOnInit() {

    this.history = history.state;

    if (this.history.name && this.history.id !== null  ) {

    this.rowData2 = [this.history];

    this.name = this.history.nameChild ||  this.history.name;
    this.id = this.history.id;
    this.idChild = this.history.idChild;

    this.startDate.setFullYear(this.startDate.getFullYear() - 5);



    this.consultaHistorico(true)



  }else{
    this.previousPage();
  }

}

consultaHistorico(checked) {

  let params = new HttpParams();
 // params = params.append('doctorId', this.atendimento.doctorId);
  params = params.append('userId', this.id);
  if(this.idChild!==null){
      params = params.append('childId', this.idChild);
  }
  params = params.append('startDate', moment(this.startDate).format('YYYY/MM/DD'));
  params = params.append('statusIds', '7,10,4,8'); // Use a string para o statusId

  this.isActive = true;
  let allData = []; // Crie uma variável vazia para armazenar os dados
  this.service.buscaAtendimentos(params, (response) => {
      response.forEach(data => {
          allData.push({
              name: data.doctor.name,
              birthDate: moment(data.child.birthDate).format('DD/MM/YYYY') ?? moment(data.user.birthDate).format('DD/MM/YYYY'),
              id: data.id,
              dateService: data.dateService,
              horario: data.startTime +" - "+ data.endTime,
              typeService: data.typeService,
              cellPhoneUser: data.user.cellPhone,
              emailUser:data.user.emailUser,
              federalIdUser: data.user.federalId,
              NameResponse: data.user.name,
              status: data.status,
              avatar: data.avatar || this.avatar,
              
          });
      });

      if (allData.length === 0) {
          this.toastrService.warning("Não Foram Encontradas Consultas Para Este Paciente.", 'Aditi Care');
          this.isActive = false;
          this.rowData = null;

      }else{
          this.isActive = false;
          this.rowData = allData;
      }


  }, (error) => {
      this.isActive = false;
      if (error && error.status === 400) {
          this.toastrService.warning("Não Foram Encontradas Consultas Para Este Paciente.", 'Aditi Care');
      }
  });

}

  previousPage() {
    this.router.navigate(['/pages/gestao-paciente/paciente'])
  }
}
