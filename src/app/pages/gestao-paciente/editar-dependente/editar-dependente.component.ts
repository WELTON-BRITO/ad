import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { CPFValidator } from '../../shared/validators/CPFValidator';
import { DependenteService } from '../dependente/dependente.service';

@Component({
  selector: 'ngx-editar-dependente',
  styleUrls: ['./editar-dependente.component.scss'],
  templateUrl: './editar-dependente.component.html',
})
export class EditarDependenteComponent implements OnDestroy {

  public formDependente = null;
  public isActive = false;
  public sexo = null;
  public listSanguino = null;
  public register = null;
  public history = null;


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private service: DependenteService,
    private toastrService: NbToastrService) {

    this.listSanguino = [
      {
        tipoSanguineo: '1',
        descricao: 'A'
      },
      {
        tipoSanguineo: '2',
        descricao: 'B'
      },
      {
        tipoSanguineo: '3',
        descricao: 'O'
      },
      {
        tipoSanguineo: '4',
        descricao: 'AB'
      },
      {
        tipoSanguineo: '5',
        descricao: 'O+'
      },
      {
        tipoSanguineo: '6',
        descricao: 'B+'
      },
      {
        tipoSanguineo: '7',
        descricao: 'B-'
      },
      {
        tipoSanguineo: '8',
        descricao: 'A+'
      },
      {
        tipoSanguineo: '9',
        descricao: 'A-'
      },
      {
        tipoSanguineo: '10',
        descricao: 'AB+'
      },
      {
        tipoSanguineo: '11',
        descricao: 'AB-'
      },
    ]
  }

  ngOnDestroy() { }

  ngOnInit() {

    this.history = history.state;

    if( this.history.name!=null){
    this.formDependente = this.formBuilder.group({
      nomeDep: this.history.name,
      dateNascDep: this.history.birthDate,
      nomeMae: this.history.nameMother,
      nomePai: this.history.nameFather,
      cpfDep: this.history.cpf,
      rgDep: this.history.rg,
      tipoSanguineo: this.history.bloodType,
      id: this.history.idChild,
    })

    this.viewdiv(this.history.biologicalSex)


  }else{
    this.previousPage();

  }

  }

  viewdiv(sexoSelecionado: string) {
    // Acesse o elemento de rádio masculino e feminino pelo ID
    const radioMasculino = document.getElementById("radio-masculino") as HTMLInputElement;
    const radioFeminino = document.getElementById("radio-feminino") as HTMLInputElement;
  
    // Verifique qual rádio foi selecionado e defina o valor apropriado
    if (sexoSelecionado === "M") {
      // Defina o valor "M" para o sexo masculino
      radioMasculino.checked = true;
      radioFeminino.checked = false;
    } else if (sexoSelecionado === "F") {
      // Defina o valor "F" para o sexo feminino
      radioMasculino.checked = false;
      radioFeminino.checked = true;
    }
    this.sexo = sexoSelecionado;
  }




  isValidCpf(element, data) {

    if (element.id === 'cpf') {
      if (!CPFValidator.isValidCPF(data.cpf)) {
        this.toastrService.danger('Cpf Informado é Inválido','Aditi Care');
        return false;
      }
      return true;
    } else if (element.id === 'cpfDep') {
      if (!CPFValidator.isValidCPF(data.cpfDep)) {
        this.toastrService.danger('Cpf Informado é Inválido','Aditi Care');
        return false;
      }
      return true;
    }

  }


  salvar(data){

    const id = data.id;

    let register = {
      name: data.nomeDep,
      birthDate: data.dateNascDep,
      nameMother: data.nomeMae,
      nameFather: data.nomePai,
      cpf: data.cpfDep,
      rg: data.rgDep,
      bloodType: data.tipoSanguine,
      biologicalSex: this.sexo
    }

    this.isActive = true;

    this.service.AtualizarDependente(register, id, (response => {
      this.isActive = false;
      this.toastrService.success('Dependente Atualizado com Sucesso','Aditi Care');
      this.previousPage();
    }), (error) => {
      this.isActive = false;
      this.toastrService.danger(error.error.message);
    });
  

  }

  previousPage() {
    this.router.navigate(['/pages/gestao-paciente/dependente'])
  }
}
