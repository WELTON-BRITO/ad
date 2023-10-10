import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ListMedicoService } from './list-medico.service';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';

declare var $: any;

@Component({
  selector: 'ngx-list-medico',
  styleUrls: ['./list-medico.component.scss'],
  templateUrl: './list-medico.component.html',
})
export class ListMedicoComponent implements OnDestroy {

  public formListMedico = null;
  public rowData: any[];
  public listEstado = null;
  public isActive = false;
  public clinicId = null;
  public avatar = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: ListMedicoService,
    private toastrService: NbToastrService,) {

  }
  ngOnDestroy() { }
  ngOnInit() {

    this.formListMedico = this.formBuilder.group({
      cpf: [null],
    })

    let clinicId = localStorage.getItem('bway-entityId')

    this.service.buscaDoctorClinic(clinicId, null, (response) => {

      this.rowData = response    
      this.rowData = this.rowData.map(data => {
       
        return {
          avatar: 'data:application/pdf;base64,' + data.avatar,
          id: data.id,
          name: data.name,
          specialty: data.specialty == null ? null : data.specialty[0].name,
        }
      })  

    }, (error) => {
      this.toastrService.danger(error.error.message);
    });

  }

  pesquisaMedico(data) {

    if (data.cpf != null) {

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
            specialty: data.specialty == null ? null : data.specialty[0].name,
          }
        })

      }, (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);
      });

    } else {
      this.toastrService.danger('Preencher campo obrigatório!!!');
    }

  }

  desvincular(data){

     this.clinicId = localStorage.getItem('bway-entityId')

    let register = {

      doctorId: data.id,
      clinicId: this.clinicId

    }

    this.service.doctorClinic(register, (response) => {

      this.isActive = false;
     
    }, (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);
    });
   
  }

}
