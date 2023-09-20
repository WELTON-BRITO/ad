import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ListMedicoService } from './list-medico.service';
import { HttpParams } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'ngx-list-medico',
  styleUrls: ['./list-medico.component.scss'],
  templateUrl: './list-medico.component.html',
})
export class ListMedicoComponent implements OnDestroy {

  public formListMedico = null;
  public rowData: any [];
  public listEstado = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: ListMedicoService) {      
    
  }
  ngOnDestroy() { }
  ngOnInit() {

    this.formListMedico = this.formBuilder.group({      
      cpf: [null],
      checkMedico: [null]
    })

  }
  
  pesquisaMedico(data){

    let params = new HttpParams();   
    
    
  console.log(data)
    //params = params.append('federalId', data.cpf)

      this.service.buscaDoctor(null, (response) => {

        console.log(response[0])
  
        this.rowData = response

        /*this.rowData = this.rowData.map(data => {
          return {
            nome: data.name,
                       
          }
        })*/

  
      }, (error) => {
        console.log(error)
        //this.notifications.error(error.message);        
      });
  
  }

  cadastrar(data){
    console.log(data)
  }

  salvar(data){
   
  }
 
}
