import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { AtendimentoService } from '../atendimento.service';
import * as moment from 'moment';
import { FormBuilder, Validators } from '@angular/forms';
import { SearchZipCodeService } from '../../shared/services/searchZipCode.services';
import { Observable, Subscriber } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { CPFValidator } from '../../shared/validators/CPFValidator';



@Component({
    selector: 'ngx-nota-fiscal-atendimento',
    styleUrls: ['./nota-fiscal-atendimento.scss'],
    templateUrl: './nota-fiscal-atendimento.html',
})
export class notaFiscalComponent {

    public formNovoAtendimento = null;
    public listMedico = null;
    public isActive = false;
    public specialtyId = null;
    public listTipoEspecialidade = null;
    public doctorId = null;
    public clinicId = null;
    public isConfAtendimento = false;
    public patchPaciente = null;
    public rowData = [];
    public listCidade = null;
    public isLoader: boolean = false;
    public formNovoPaciente = null;
    public listEstado = null;
    public userid = null;
    public validate = null;
    public update = false;
    

    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private toastrService: NbToastrService,
        private serviceCep: SearchZipCodeService,
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
        
        this.ValidateRegister(this.userid);

        
        this.buscaEstado();
   
        this.formNovoPaciente = this.formBuilder.group({
            nome: [null],
            cpf: [null],
            estado: [null],
            cidade: [null],
            bairro: [null],
            numero: [null],
            endereco: [null],
            cep: [null],
            email: [null],
            celular: [null],
            complemento: [null],
            cidadeDescription: [null],
            cidadeId: [null],
          })  
           
          if (data && data.atendimento && data.atendimento.userFederalId) {
            this.pesquisaGeral(data.atendimento.userFederalId);
          }
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


    pesquisaGeral(data) {
      this.fetchData(true);
    
      let params = new HttpParams();
      params = params.append('federalId', data);
    
      this.isActive = true;
    
      this.service.buscaPaciente(params, data, (response) => {
        // Verifique se a resposta é um objeto
        if (response && typeof response === 'object') {
          const allData = {
            nameCity: response.city,
            ufName: response.uf,
            cep: response.zipCode,
            rua: response.street,
            bairro: response.neighborhood,
            numero: response.number,
            complemento: response.complement
          };
    
          this.formNovoPaciente.get('bairro').setValue(allData.bairro); // Clear the value
          this.formNovoPaciente.get('complemento').setValue(allData.complemento); // Clear the value
          this.formNovoPaciente.get('numero').setValue(allData.numero); // Clear the value
          this.formNovoPaciente.get('endereco').setValue(allData.rua); // Clear the value
          this.formNovoPaciente.get('cep').setValue(allData.cep); // Clear the value
          this.formNovoPaciente.get('cidadeId').setValue(allData.nameCity.id); // Clear the value
          this.formNovoPaciente.get('cidadeDescription').setValue(allData.nameCity.description); // Clear the value     

        } else {
          console.error('A resposta não é um objeto:', response);
        }
    
        this.fetchData(false);
      }, (error) => {
        this.isActive = false;
        this.toastrService.danger(error.error.message, 'Aditi Care');
        this.fetchData(false);
      });
    }
    
    

    ValidateRegister(data) {

        this.fetchData(true)

        if(this.userid !== null){
    
    
        this.service.ValidateNFS(this.userid, data, (response) => {
    
          this.validate = response

          if(this.validate.federalId !=null){

            this.update=true;

            this.userid = this.validate.id

            this.formNovoPaciente.get('cpf').setValue(this.validate.federalId); // Clear the value
            this.formNovoPaciente.get('nome').setValue(this.validate.name); // Clear the value
            this.formNovoPaciente.get('email').setValue(this.validate.email); // Clear the value
            this.formNovoPaciente.get('celular').setValue(this.validate.phone); // Clear the value
            this.formNovoPaciente.get('bairro').setValue(this.validate.neighborhood); // Clear the value
            this.formNovoPaciente.get('complemento').setValue(this.validate.complement); // Clear the value
            this.formNovoPaciente.get('numero').setValue(this.validate.number); // Clear the value
            this.formNovoPaciente.get('endereco').setValue(this.validate.street); // Clear the value
            this.formNovoPaciente.get('cep').setValue(this.validate.zipCode); // Clear the value
            this.formNovoPaciente.get('cidadeId').setValue(this.validate.city); // Clear the value
            this.formNovoPaciente.get('cidadeDescription').setValue(this.validate.codeCity); // Clear the value       

          }
    
          this.fetchData(false)
    
    
        }, (error) => {
          this.fetchData(false)
    
        });

        this.fetchData(false)

    }
      }
      

    buscaCidade(data) {

        this.fetchData(true)
    
    
        this.service.buscaCidade(null, data, (response) => {
    
          this.listCidade = response
    
          this.fetchData(false)
    
    
        }, (error) => {
          this.toastrService.danger(error.message,'Aditi Care');
          this.fetchData(false)
    
        });
      }
    
      isValidCpf(element, data) {

        if (element.id === 'cpf') {
          if (!CPFValidator.isValidCPF(data.cpf)) {
            this.toastrService.danger('O Cpf Informado não é Inválido','Aditi Care');
            this.formNovoPaciente.get('cpf').setValue(null); // Clear the value
    
            return false;
          return false;
          }
          return true;
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
        if (data.nome == null) {
            this.toastrService.danger('O campo Nome deve Ser Preenchido', 'Campo Não Informado')
            return false
        }
        if (data.celular == null) {
            this.toastrService.danger('O campo Celular deve Ser Preenchido', 'Campo Não Informado')
            return false
        }
        if (data.email == null) {
            this.toastrService.danger('O campo Email deve Ser Preenchido', 'Campo Não Informado')
            return false
        }

        return true
    }

    formatName(name: string): string {
      return name.split(' ')
                 .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                 .join(' ');
  }

   updateCidadeInfo() {

    const select = document.getElementById('cidade') as HTMLSelectElement;
    const selectedOption = select.options[select.selectedIndex];
    const cidadeId = selectedOption.value;
    const cidadeDescription = selectedOption.text;
  
    this.formNovoPaciente.get('cidadeId').setValue(cidadeId); // Clear the value
    this.formNovoPaciente.get('cidadeDescription').setValue(cidadeDescription); // Clear the value


  }
  
  

    CadastrarNota(data) {

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

        if( this.update == false){

        this.service.salvardadosNota(register, (response => {
            this.isActive = false;
            this.toastrService.success('Dados Cadastrados Com Sucesso','Aditi Care!');
            this.fetchData(false)

            this.previousPage();
        }), (error) => {
            this.isActive = false;
            this.toastrService.danger(error.message,'Aditi Care');
            this.fetchData(false)

        });

    }else{

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
        

    }
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

    buscaEstado() {

        this.fetchData(true)
    
    
        this.service.buscaEstado(null, (response) => {
    
          this.fetchData(false)
    
    
          this.listEstado = response
        }, (error) => {
          this.toastrService.danger(error.error.message);
          this.fetchData(false)
    
        });
    
      }
    
      buscaCep(data) {
    
        this.fetchData(true)

        if (data && data.cep != null) {

            this.serviceCep.buscaCep(data.cep, null, (response) => {
    
                this.formNovoPaciente.controls['endereco'].setValue(response.logradouro.replace('Rua', '').replace('Avenida', '').trim());
                this.formNovoPaciente.controls['bairro'].setValue(response.bairro.trim());
          
                this.fetchData(false)
          
              }, (error) => {
                this.toastrService.danger('O Cep Informado é Inválido', 'Aditi Care');
                this.formNovoPaciente.get('cep').setValue(null); // Clear the value

                this.fetchData(false)
          
              });        } 
              else {
            this.toastrService.danger('O Cep Informado é Inválido', 'Aditi Care');
            this.formNovoPaciente.get('cep').setValue(null); // Clear the value
            this.fetchData(false)



        }    
    
      
      }




}