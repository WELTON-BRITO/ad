/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GerarQrCodeService } from './gerar-qr-code.service';
import { NbToastrService } from '@nebular/theme';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'ngx-gerar-qr-code',
  styleUrls: ['./gerar-qr-code.component.scss'],
  templateUrl: './gerar-qr-code.component.html',
})
export class GerarQrCodeComponent implements OnDestroy {

  public formQrCode = null;
  public listMedico = null;
  public isActive = false;
  public durationAtHome = null;
  public durationEmergency = null;
  public durationInPerson = null;
  public durationRemote = null;
  public pixCode = null;
  public qrCode = null;
  public valueAtHome = null;
  public valueInPerson = null;
  public valueInPersonEmergency = null;
  public valueRemote = null;
  public doctorId = null;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: GerarQrCodeService,
    private toastrService: NbToastrService) { }
  ngOnDestroy() { }
  ngOnInit() {

    this.listMedico = JSON.parse(localStorage.getItem('bway-medico'));

    if (this.listMedico && this.listMedico.length > 0) {
    } else {
      console.error('A lista de médicos está vazia ou não definida!');
     this.toastrService.warning('Sua Sessão foi Encerrada, Efetue um Novo Login','Aditi Care');
    
    {
            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 3000); // 3000 milissegundos = 3 segundos
        }
    }

    this.formQrCode = this.formBuilder.group({
      qrCode: [null],
      medico: [this.listMedico[0], Validators.required]
    })

    this.formQrCode.controls['medico'].setValue(this.listMedico[0].id, {onlySelf: true}); // use the id of the first medico

  } 

  verificaValor(data) {

    this.isActive = true

    if (data != 'null') {

      let params = new HttpParams();
      params = params.append('doctorId', data)

      this.service.buscaValor(null, data, (response) => {
        this.isActive = false;

        this.durationAtHome = response.durationAtHome,
          this.durationEmergency = response.durationEmergency,
          this.durationInPerson = response.durationInPerson,
          this.durationRemote = response.durationRemote,
          this.pixCode = response.pixCode,
          this.qrCode = response.qrCode,
          this.valueAtHome = response.valueAtHome,
          this.valueInPerson = response.valueInPerson,
          this.valueInPersonEmergency = response.valueInPersonEmergency,
          this.valueRemote = response.valueRemote,
          this.doctorId = response.doctor.id

      }, (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);
      });

    } else {
      this.toastrService.danger('Preencher o campo obrigatório!!!');
    }
  }

  salvar(data) {

    if (data.medico == null || data.qrCode == null) {

      this.toastrService.danger('Campo médico e código copia e cola tem que ser preenchidos !!!');

    } else {

      let register = {
        valueInPerson: this.valueInPerson,
        valueRemote: this.valueRemote,
        doctorId: this.doctorId,
        valueInPersonEmergency: this.valueInPersonEmergency,
        valueAtHome: this.valueAtHome,
        durationInPerson: this.durationInPerson,
        durationAtHome: this.durationAtHome,
        durationRemote: this.durationRemote,
        durationEmergency: this.durationEmergency,
        qrCode: data.qrCode,
        pixCode: this.pixCode,
      }

      this.isActive = true;

      this.service.salvarQRCode(register, (response => {

        this.isActive = false;
        this.toastrService.success('QR code cadastrado com sucesso !!!','Aditi Care!');

        this.limparForm();

      }), (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);

      });
    }

  }

  limparForm() {

    this.formQrCode = this.formBuilder.group({
      qrCode: [null],
      medico: [null]
    })

  }

}
