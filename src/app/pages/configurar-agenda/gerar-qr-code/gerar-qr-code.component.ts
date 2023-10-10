import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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

    var name = localStorage.getItem('bway-domain');
    var id = localStorage.getItem('bway-entityId');

    if (name == 'CLINIC') {
      this.pesquisaClinica(id)
    } else {
      this.pesquisaMedico(id);
    }

    this.formQrCode = this.formBuilder.group({
      qrCode: [null],
      medico: [null]
    })

  }

  pesquisaMedico(data) {

    this.isActive = true

    let params = new HttpParams();
    params = params.append('doctorId', data)

    this.service.buscaDoctor(params, (response) => {

      this.listMedico = response
      this.isActive = false

    }, (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);
    });

  }

  pesquisaClinica(data) {
    this.isActive = true
    this.service.buscaClinica(data, null, (response) => {

      this.listMedico = response
      this.isActive = false

    }, (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);
    });

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
        this.toastrService.success('QR code cadastrado com sucesso !!!');

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
