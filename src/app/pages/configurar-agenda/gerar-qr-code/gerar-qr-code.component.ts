import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-gerar-qr-code',
  styleUrls: ['./gerar-qr-code.component.scss'],
  templateUrl: './gerar-qr-code.component.html',
})
export class GerarQrCodeComponent implements OnDestroy {

  public formQrCode = null;
  public listMedico = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router) {

      this.listMedico = [
        {
          medico: '1',
          descricao: 'Welton Luiz de Almeida Brito'
        },
        {
          medico: '2',
          descricao: 'Camila Marcia Parreira Silva'
        },
        {
          medico: '3',
          descricao: 'Ryan Carlos Silva Almeida Brito'
        },
        {
          medico: '4',
          descricao: 'Yasmim Vitória Silva Almeida Brito'
        }
      ]

  }
  ngOnDestroy() { }
  ngOnInit() {

    this.formQrCode = this.formBuilder.group({
      qrCode: [null],
      medico: [null]
    })

  }

  salvar(data) {
    console.log(data)
   
  }


}
