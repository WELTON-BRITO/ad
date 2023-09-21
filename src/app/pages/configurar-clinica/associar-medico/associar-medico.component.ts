import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ListMedicoService } from '../list-medico/list-medico.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'ngx-associar-medico',
  styleUrls: ['./associar-medico.component.scss'],
  templateUrl: './associar-medico.component.html',
})
export class AssociarMedicoComponent implements OnDestroy {

  public formAssociarMedico = null;
  public rowData: any [];
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: ListMedicoService) {      
    
  }
  ngOnDestroy() { }
  ngOnInit() {

    this.formAssociarMedico = this.formBuilder.group({      
      cpf: [null],
      checkMedico: [null]
    })

  }
  
  pesquisaMedico(data){

    let params = new HttpParams();
  
    //params = params.append('federalId', data.cpf)

      this.service.buscaDoctor(null, (response) => {

        console.log(response)
  
        //this.rowData = response

        this.rowData = this.rowData.map(data => {
          return {
            name: data.name,
                       
          }
        })

  
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
