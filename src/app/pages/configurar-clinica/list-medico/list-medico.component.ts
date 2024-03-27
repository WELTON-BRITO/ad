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
  public avatar = "assets/images/avatar.png";
  public clinicId = localStorage.getItem('bway-entityId')


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: ListMedicoService,
    private toastrService: NbToastrService,) {

  }
  ngOnDestroy() { }
  ngOnInit() {

  this.buscarMedicos();
   
  }

  buscarMedicos()
  {
    this.isActive = true;

    this.service.buscaDoctorClinic(this.clinicId, null, (response) => {

      this.rowData = response    
      this.rowData = this.rowData.map(data => {
       
        return {
          avatar: data.avatar == null || data.avatar == "" ? this.avatar : 'data:application/pdf;base64,' + data.avatar,
          id: data.id,
          name: data.name,
          specialty: data.specialty == null ? null : data.specialty[0].name,
        }
        
      })

    }, (error) => {
      this.toastrService.danger(error.error.message);
    });

    this.isActive = false;

  }

  AtualizarAvatar(){
    this.toastrService.warning('Funcionalidade Ainda em Desenvolvimento','Aditi Care');

  }

  desvincular(data){

    this.isActive = false;

    let register = {

      doctorId: data.id,
      clinicId: this.clinicId

    }

    this.service.doctorClinic(register, (response) => {

      this.toastrService.success('Médico Removido com Sucesso','Aditi Care');

      this.buscarMedicos();
    
    }, (error) => {
      this.toastrService.danger(error.error.message);
    });

    this.isActive = true;

  }


}

