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
  public avatar = "assets/images/avatar.png";
  
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

    if (data.cpf != null) {

      params = params.append('federalId', data.cpf)

      this.isActive = true;

      this.service.buscaDoctor(params, (response) => {

        if (response.length <= 0) {
          this.toastrService.warning('Este CPF não Pode Ser Associado.','Aditi Care');
      }

        this.rowData = response
        this.isActive = false;
        this.rowData = this.rowData.map(data => {
          return {
            avatar: data.avatar == null || data.avatar == "" ? this.avatar : 'data:application/pdf;base64,' + data.avatar,
            id: data.id,
            name: data.name,
            specialty: data.specialty == null ? null : data.specialty[0].name,
          }
        })

      }, (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);
      });

    } else {
      this.toastrService.danger('O CPF deve Ser Preenchido','Aditi Care');
    }

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
      this.toastrService.success('Médico Associado com Sucesso','Aditi Care!');

      this.limparForm();

    }), (error) => {
      this.isActive = false;
      this.toastrService.danger(error.message);

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
