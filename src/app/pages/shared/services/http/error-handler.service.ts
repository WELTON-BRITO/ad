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
 if (error.status === 401) {
 // Redirecionar para a página de login ou exibir uma mensagem de erro
 router.navigate(['/login']);
 } else if (error.status === 404) {
 // Redirecionar para uma página de erro 404 ou exibir uma mensagem de erro
 router.navigate(['/404']);
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