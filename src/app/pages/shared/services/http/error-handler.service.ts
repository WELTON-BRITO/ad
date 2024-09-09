import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
    constructor(private injector: Injector) {}

    handleError(error: any): void {
        const router = this.injector.get(Router);

        if (error instanceof HttpErrorResponse) {
            // Tratar erros de requisição HTTP

            console.log("ai ai "+error)
            if (error.status === 401) {
                // Redirecionar para a página de login
                router.navigate(['/login']);
            } else if (error.status === 404) {
                // Redirecionar para uma página de erro 404
                router.navigate(['/404']);
            } else if (error.status === 500 && error.error.message === 'Invalid token') {
                // Redirecionar para a página de login se o erro for 500 e a mensagem for "Invalid token"
                router.navigate(['/login']);
            } else {
                // Exibir mensagem de erro genérica
                console.error('Ocorreu um erro na requisição HTTP:', error);
            }
        } else {
            // Tratar outros erros não relacionados à requisição HTTP
            console.error('Ocorreu um erro:', error);
        }
    }
}
