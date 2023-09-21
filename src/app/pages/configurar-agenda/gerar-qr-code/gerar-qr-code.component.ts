import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GerarQrCodeService } from './gerar-qr-code.service';

@Component({
  selector: 'ngx-gerar-qr-code',
  styleUrls: ['./gerar-qr-code.component.scss'],
  templateUrl: './gerar-qr-code.component.html',
})
export class GerarQrCodeComponent implements OnDestroy {

  public formQrCode = null;
  public listMedico = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: GerarQrCodeService) {     }
  ngOnDestroy() { }
  ngOnInit() {

    this.formQrCode = this.formBuilder.group({
      qrCode: [null],
      medico: [null]
    })

  }

  pesquisaMedico() {

    this.service.buscaDoctor(null, (response) => {

      for (var i = 0; i < response.length; i++) {

        this.listMedico = [
          {
            medico: response[i].id,
            descricao: response[i].name,
          }
        ]

      }

    }, (error) => {
      console.log(error)
    });

  }

  salvar(data) {
    console.log(data)
   
  }


}
