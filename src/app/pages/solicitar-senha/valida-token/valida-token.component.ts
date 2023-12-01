import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { SolicitarSenhaService } from '../solicitar-senha.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'ngx-valida-token',
    templateUrl: 'valida-token.component.html',
    styleUrls: ['valida-token.component.scss'],
})
export class ValidaTokenComponent {

    @Input() descricao: string;
    @Input() email: string;
    @Input() federalId: number;
    @Input() domainId: number;

    public formValidaToken = null;
    public isSolicitarSenha = null
    public isActive = false;
    public token = null;

    constructor(protected ref: NbDialogRef<ValidaTokenComponent>,
        private router: Router,
        private toastrService: NbToastrService,
        private service: SolicitarSenhaService,
        private formBuilder: FormBuilder,) { }

    ngOnInit() {

        localStorage.setItem('Authorization', '1');
        this.formValidaToken = this.formBuilder.group({
            token: [null, Validators.required],
        });

    }

    cancel() {
        this.ref.close();
        this.router.navigate(['/login']);
    }

    submit(data) {

        this.token = data;

        let register = {
            federalId: this.federalId,
            domainId: this.domainId,
            code: data.token
        }

        this.isActive = true;

        this.service.validateCode(register, (response => {

            this.isActive = false;
            this.ref.close();
            this.router.navigateByUrl('/alterar-senha', { state: register});

        }), (error) => {
            this.isActive = false;
            this.toastrService.danger(error.error.message);
        });

    }
}
