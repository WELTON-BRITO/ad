import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { AtendimentoService } from '../atendimento.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'ngx-triagem',
    styleUrls: ['./triagem.scss'],
    templateUrl: './triagem.html',
})
export class TriagemComponent {

    public formNovoAtendimento = null;
    public isActive = false;
    public isLoader: boolean = false;
    public formNovoPaciente = null;
    public userid = null;
    public rowData = null;
    public patchPaciente = null;
    public doctorId = null;
    
    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private toastrService: NbToastrService,
        private service: AtendimentoService) {
    }

    ngOnInit() {

        let data = history.state
        
        if (data && data.atendimento && data.atendimento.userId != null) {
            this.userid = data.atendimento.userId;
        }else if(data && data.id != null){
            this.userid = data.id;
        } 
        
        else {

            this.router.navigate(['/pages/atendimento/buscar-atendimento']);
        }

        this.doctorId = data.medicoId;

        this.formNovoPaciente = this.formBuilder.group({
            nome: [null],
            cpf: [null],
            pressao: [null],
            frequencia: [null],
            temperatura: [null],
            sintomas: [null],
            classificacao: ['']
                  })  


          if (data && data.atendimento && data.atendimento.userFederalId) {
            this.formNovoPaciente.get('cpf').setValue(data.atendimento.userFederalId);
        } else {
            this.formNovoPaciente.get('cpf').setValue(''); // Clear the value if data is not available
        }
        
        if (data) {
            const nome = data.nomeDependente ?? data.nomeResponsavel;
            this.formNovoPaciente.get('nome').setValue(nome || ''); // Clear the value if nome is not available
        } else {
            this.formNovoPaciente.get('nome').setValue(''); // Clear the value if data is not available
        }

        this.formNovoPaciente.get('classificacao').setValue('');

        
        
              }

    fetchData(data) {
        if(data){
        // Mostra o loader
        this.isLoader =true
        }else{
          setTimeout(() => {
            // Oculta o loader após o atraso
            this.isLoader =false
        }, 2000);
    }
    }

    
    

      validaCampos(data) {

        if (this.userid == null) {
            this.toastrService.danger('O UserID deve Ser Preenchido', 'Campo Não Informado')
            return false
        }
        if (data.cpf == null) {
            this.toastrService.danger('O Campo CPF deve Ser Preenchido', 'Campo Não Informado')
            return false
        }
        if (data.classificacao == null) {
            this.toastrService.danger('O Campo Classificação deve Ser Preenchido', 'Campo Não Informado')
            return false
        }
        if (data.frequencia == null) {
            this.toastrService.danger('O Campo Frequência Cardiaca deve Ser Preenchido', 'Campo Não Informado')
            return false
        }
        if (data.pressao == null) {
            this.toastrService.danger('O campo Pressão deve Ser Preenchido', 'Campo Não Informado')
            return false
        }
        if (data.sintomas == null) {
          this.toastrService.danger('O campo Sintomas deve Ser Preenchido', 'Campo Não Informado')
          return false
      }
      if (data.temperatura == null) {
        this.toastrService.danger('O campo Temperatura deve Ser Preenchido', 'Campo Não Informado')
        return false
    }

        return true
    }

    formatName(name: string): string {
      return name.split(' ')
                 .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                 .join(' ');
  }



  registrar(data) {

        this.fetchData(true)

        if(this.validaCampos(data)){

          const trimOrEmpty = (value) => (value ? value.trim() : '');

            let register = 
            {
              "userId": this.userid,
              "federalId": data.cpf,
              "name": data.nome.trim(),
              "phone": data.celular.trim(),
              "email": data.email.trim(),
              "city":data.cidadeDescription,
              "codeCity": data.cidade,
              "ufId": data.estado,
              "zipCode": data.cep,
              "street":this.formatName(this.capitalizeWords(trimOrEmpty(data.endereco))), 
              "neighborhood":this.formatName(this.capitalizeWords(trimOrEmpty(data.bairro))),
              "number": data.numero,
              "complement": data.complemento,
              "country": "BRASIL",
              "codeCountry": "1058",
            }


        this.isActive = true;

        this.fetchData(false);


/*

        this.service.UpdateNFS(register, this.userid, 
            (response) => {
                this.isActive = false;
                this.toastrService.success('Dados Cadastrados Com Sucesso', 'Aditi Care!');
                this.fetchData(false);
                this.previousPage();
            }, 
            (error) => {
                this.isActive = false;
                this.toastrService.danger(error.message, 'Aditi Care');
                this.fetchData(false);
            }
        );
        

    */
    }
    

    this.fetchData(false)

        
    }

    capitalizeWords(name: string | null | undefined): string {
      if (!name) {
          return ''; // Retorna uma string vazia se o valor for null ou undefined
      }
      return name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }
  

    previousPage() {

        this.rowData = [{
            medico: this.doctorId
          }]

        if (this.patchPaciente == true) {
            this.router.navigate(['/pages/visualizar-agenda/agenda'], { state:   this.rowData })

        }else{
            this.router.navigate(['/pages/atendimento/buscar-atendimento'], { state: this.rowData })

        }

    }

}