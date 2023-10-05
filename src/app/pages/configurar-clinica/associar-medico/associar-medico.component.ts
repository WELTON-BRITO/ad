import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { DomSanitizer } from '@angular/platform-browser';
import { AssociarMedicoService } from './associar-medico.service';

@Component({
  selector: 'ngx-associar-medico',
  styleUrls: ['./associar-medico.component.scss'],
  templateUrl: './associar-medico.component.html',
})
export class AssociarMedicoComponent implements OnDestroy {

  public formAssociarMedico = null;
  public rowData: any[];
  public isActive = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: AssociarMedicoService,
    private toastrService: NbToastrService,
    private sanitizer: DomSanitizer,) {

  }
  ngOnDestroy() { }
  ngOnInit() {

    this.formAssociarMedico = this.formBuilder.group({
      cpf: [null]
    })

  }


  pesquisaMedico(data) {

    let params = new HttpParams();
    params = params.append('federalId', data.cpf)

    this.isActive = true;

    this.service.buscaDoctor(params, (response) => {

      this.rowData = response
      this.isActive = false;
      this.rowData = this.rowData.map(data => {
        return {
          avatar: 'data:application/pdf;base64,' + data.avatar,
          id: data.id,
          name: data.name,
          specialty: data.specialty[0].name
        }
      })

    }, (message) => {
      this.isActive = false;
      this.toastrService.danger(message);
    });
  }

  cadastrar(data) {

    let clinicId = localStorage.getItem('bway-entityId')

    let register = {

      doctorId: data.id,
      clinicId: clinicId

    }

    this.isActive = true;

    this.service.associarDoctor(register, (response => {

      this.isActive = false;
      this.toastrService.success(response.socialName + 'associado com sucesso !!!');

      this.limparForm();

    }), message => {
      this.isActive = false;
      this.toastrService.danger(message);

    });
  }

  excluir(data) {

  }

  limparForm() {

    this.formAssociarMedico = this.formBuilder.group({
      cpf: [null]
    })
    this.rowData = [];

  }

}
