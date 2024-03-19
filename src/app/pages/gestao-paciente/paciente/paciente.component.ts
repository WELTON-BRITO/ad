import { Component, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from './paciente.service';
import { HttpParams } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';

import * as moment from 'moment';

@Component({
  selector: 'ngx-paciente',
  styleUrls: ['./paciente.component.scss'],
  templateUrl: './paciente.component.html',
})
export class PacienteComponent implements OnInit {

  public formPaciente = null;
  public listPaciente = null;
  public rowData = null;
  public listMedico = null;
  public isActive = false;
  public avatar = "assets/images/avatar.png";

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: PacienteService,
    private toastrService: NbToastrService,
    private errorHandler: ErrorHandler) { }

  ngOnInit() {

    this.listMedico = JSON.parse(sessionStorage.getItem('bway-medico'));

    this.formPaciente = this.formBuilder.group({
      cpf: [null],
      medico: [this.listMedico[0], Validators.required],
      optPart: "S",
      nome: null,
    })

    this.formPaciente.controls['medico'].setValue(this.listMedico[0].id, { onlySelf: true });

    let registe = {
      cpf: null,
      medico: this.listMedico[0].id,
      optPart: "S",
      nome: null,
    }

    if(localStorage.getItem('meuPaciente') ===null || localStorage.getItem('meuPaciente') ==='') {

      this.pesquisaGeral(registe,true)
    }else{
      this.pesquisaGeral(registe,false)
    }

  }

  ValidarUsuario(data,form){

    if(form.cpf == null && data === 'N'){

      this.toastrService.danger('Por Favor Informe o CPF do Usuário','Aditi Care');
      this.formPaciente.controls['optPart'].setValue(null, { onlySelf: true });
    }

  }

   limparCpf(cpf: string): string {
    // Substitui acentos e caracteres especiais por seus equivalentes sem acento
    const cpfSemAcentos = cpf
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  
    // Remove espaços, pontos e hífens
    const cpfLimpo = cpfSemAcentos
      .replace(/\s+/g, '_') // Substitui espaços por underscores
      .replace(/[.-]/g, ''); // Remove pontos e hífens
  
    return cpfLimpo;
  }

  pesquisaGeral(data,checked) {

    if(localStorage.getItem('meuPaciente') ===null  || checked==true || localStorage.getItem('meuPaciente') ===''){

      localStorage.removeItem('meuPaciente'); //garante que o cache foi apagado das telas posteriores

    let params = new HttpParams();

    if(data.optPart == null){
      this.toastrService.warning('O Campo Usuário é Paciente Deve ser Informado','Aditi Care');
    }

    if (data.medico != null && data.optPart == 'S') {
      params = params.append('doctorId', data.medico)
    }
    if (data.cpf != null && data.cpf) {
      params = params.append('federalId', this.limparCpf(data.cpf))
    }

    if (data.nome != null && data.nome) {
      params = params.append('name', data.nome)
    }


    if ((data.cpf != null) || (data.medico != 'null')) {

      this.isActive = true;
      let allData = []; // Crie uma variável vazia para armazenar os dados
      this.service.buscaPaciente(params, (response) => {
        allData = response
        .map(data => ({
          avatar: data.avatar == null || data.avatar == "" ? this.avatar : 'data:application/pdf;base64,' + data.avatar,
          name: data.name,
          nameChild: data.nameChild,
          idChild: data.idChild,
          cellPhone: data.cellPhone,
          email: data.emailUser,
          federalId: data.federalId,
          id: data.idUser  ,
          city: data.idCityUser ,
          uf: data.idUfUser,
          userChildren: data.idUserChildren,
          doctorId: data.idDoctor,
          birthDateChild:  data.birthDateChild,
          birthDate:  data.birthDate,
                        }));

  if (allData.length === 0) {
      this.toastrService.warning("Não Foram Encontradas Usuários", 'Aditi Care');
      this.saveData('meuPaciente', null);
      this.isActive = false;
      this.rowData = null;
  } else {
      this.saveData('meuPaciente', allData);
      this.isActive = false;
      this.rowData = allData;
  }

      }, (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message);
      });

    } else {
      this.toastrService.warning('O campos médico ou CPF são obrigatórios!!!');
    }

  }else {

    const allData = localStorage.getItem('meuPaciente')
    
    if (allData) {
    // Converta os dados de string para objeto
    const parsedData = JSON.parse(allData);
    
    // Preencha os cards com os dados recuperados
    this.rowData = parsedData;
    }
    }

  }

   // Salva os dados no LocalStorage
   saveData(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Recupera os dados do LocalStorage
  getData(key: string): any {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  }

  cadastrar(data) {
    let register = {
      data: data,
      tipo: 'cadastrar'
    }

    this.router.navigateByUrl('/pages/gestao-paciente/dependente', { state: register });
  }

  visualizar(data) {
    let register = {
      data: data,
      tipo: 'visualizar'
    }
    this.router.navigateByUrl('/pages/gestao-paciente/dependente', { state: register });
  }

  novoPaciente() {
    this.router.navigate(['/pages/gestao-paciente/novo-paciente']);
  }

  precoEspecial(data) {
    this.router.navigateByUrl('/pages/gestao-paciente/preco-especial', { state: data });
  }

  buscaHistorico(data) {
    this.router.navigateByUrl('/pages/gestao-paciente/historico', { state: data });
  }
}
