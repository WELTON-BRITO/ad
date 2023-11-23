import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';

@Component({
    selector: 'ngx-valida-token',
    templateUrl: 'valida-token.component.html',
    styleUrls: ['valida-token.component.scss'],
})
export class ValidaTokenComponent {

    @Input() descricao: string;
    @Input() email: string;

    isSolicitarSenha = null

    constructor(protected ref: NbDialogRef<ValidaTokenComponent>,
        private router: Router,) { }

    cancel() {
        this.ref.close();
        this.router.navigate(['/login']);
    }

    submit() {

        this.ref.close();
        this.router.navigate(['/alterar-senha']);
        
    }
}
