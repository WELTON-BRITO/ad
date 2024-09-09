import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { LoadingBarService } from "ng2-loading-bar";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../../../environments/environment";
import { Router } from '@angular/router';
import { delay } from "rxjs-compat/operator/delay";


@Injectable()
export class HttpService {
  protected urlBase = environment.url_server;
  protected urlCep = 'https://viacep.com.br';

  constructor(
    private http: HttpClient,
    private loadingBarService: LoadingBarService,
    private route: ActivatedRoute,
    private router: Router

  ) { }

  private responsecallback(
    observable: Observable<HttpResponse<Object>>,
    successHandle: Function,
    errorHandle: Function

  ) {
    try {
      observable.subscribe(
        (res) => {
          const retorno =res.body ||res.statusText
          successHandle(retorno);
          this.loadingBarService.complete();
        },
        (err) => {
          if((parseInt(err.status) == 204)){
            successHandle(err);
            this.loadingBarService.complete();

          }else if((parseInt(err.status) == 200)){
            successHandle(err);
            this.loadingBarService.complete();
          }
          else if (parseInt(err.status) == 500 ||parseInt(err.status) == 401 ) {
            console.log("aqui1"+ err)
            console.log("aqui1"+ err.message)
            {
             setTimeout(() => {
                 this.router.navigate(['/login']);
             }, 3000); // 3000 milissegundos = 3 segundos
         }
     } else {
              errorHandle(err);
              this.loadingBarService.complete();
            //  throw err;
            }

          }

      );
    } catch (err) {
      if (errorHandle != null) {
        errorHandle({
          message:
            "Algo inesperado aconteceu. Entre em contato com o administrador do sistema.",
          status: null,
        });
        this.loadingBarService.complete();
      } else {
        this.loadingBarService.complete();
        throw err;
      }
    }
  }
  private getErrorMessage(err: any): any {
    console.log("Erro xxxx:", err);

    if (parseInt(err.status) >= 400 && parseInt(err.status) < 500) {
        if (parseInt(err.status) == 401) {
            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 3000); // 3000 milissegundos = 3 segundos
        } else if (parseInt(err.status) == 200) {
            return { message: "Realizar a operação.", status: err.status };
        } else if (parseInt(err.status) >= 500) {
            return { message: "Não foi possível realizar a operação.", status: err.status };
        } else if (parseInt(err.status) == 500) {
            console.log("Erro 500:", err);
            console.log("Mensagem de erro:", err.message);
            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 3000); // 3000 milissegundos = 3 segundos
        } else if (err.error.errors && err.error.errors.length > 0) {
            let errMessage = "";
            if (err.error.errors[0].simpleUserMessage) {
                errMessage = err.error.errors[0].simpleUserMessage;
            } else if (err.error.errors[0].userMessage) {
                errMessage = err.error.errors[0].userMessage;
            } else {
                errMessage = err.error.errors[0].technicalMessage;
            }
            return { message: errMessage, status: err.status };
        }
    } else {
        return { message: 'Erro não verificado.', status: err.status };
    }
}


  public doPost(
    path: string,
    body: any,
    successHandle: Function,
    errorHandle?: Function
  ) {
    this.loadingBarService.reset();
    this.loadingBarService.start();

    let url = this.urlBase + path;
    return this.responsecallback(
      this.http.post(url, body, { observe: "response" }),
      successHandle,
      errorHandle
    );

  }

  public doPut(
    path: string,
    body: any,
    successHandle: Function,
    errorHandle?: Function
  ) {
    this.loadingBarService.reset();
    this.loadingBarService.start();

    let url = this.urlBase + path;

    return this.responsecallback(
      this.http.put(url, body, { observe: "response" }),
      successHandle,
      errorHandle
    );
  }

  public doDelete(
    path: string,
    params: any,
    successHandle: Function,
    errorHandle?: Function
  ) {
    this.loadingBarService.reset();
    this.loadingBarService.start();

    let url = this.urlBase + path;
    return this.responsecallback(
      this.http.delete(url, { params, observe: "response" }),
      successHandle,
      errorHandle
    );

  }

  public doDeleteNothingParameters(
    path: string,
    successHandle: Function,
    errorHandle?: Function
  ) {
    this.loadingBarService.reset();
    this.loadingBarService.start();

    let url = this.urlBase + path;
    return this.responsecallback(
      this.http.delete(url, { observe: "response" }),
      successHandle,
      errorHandle
    );

  }

  public doGet(
    path: string,
    params: any,
    successHandle: Function,
    errorHandle?: Function
) {
    this.loadingBarService.reset();
    this.loadingBarService.start();

    let url = this.urlBase + path;
    if (params == null) params = {};

    console.log("Iniciando requisição...");

    this.http.get(url, { params, observe: "response" }).subscribe(
        (response: any) => {
            this.loadingBarService.complete();
            if (response.status === 200 && response.body) {
                successHandle(response.body);
            } else {
                console.log("Erro na resposta:", response);
                const errorMessage = this.getErrorMessage(response);
                errorHandle(errorMessage);
            }
        },
        (error: any) => {
            this.loadingBarService.complete();
            console.log("Erro na requisição:", error);
            const errorMessage = this.getErrorMessage(error);
            errorHandle(errorMessage);
        }
    );
}



  public doGetCep(
    path: string,
    params: any,
    successHandle: Function,
    errorHandle?: Function
  ) {
    this.loadingBarService.reset();
    this.loadingBarService.start();

    let url = this.urlCep + path;
    let message: string = null;
    if (params == null) params = {};

    return this.responsecallback(
      this.http.get(url, { params, observe: "response" }),
      successHandle,
      errorHandle
    );
  }

  public doPatch(
    path: string,
    body: any,
    successHandle: Function,
    errorHandle?: Function
  ) {
    this.loadingBarService.reset();
    this.loadingBarService.start();

    let url = this.urlBase + path;

    return this.responsecallback(
      this.http.patch(url, body, { observe: "response" }),
      successHandle,
      errorHandle
    );
  }

  public doGetPath(
    path: string,
    params: any,
    successHandle: Function,
    errorHandle?: Function
  ) {
    this.loadingBarService.reset();
    this.loadingBarService.start();

    if (params == null) params = {};

    return this.responsecallback(
      this.http.get(path, { params, observe: "response" }),
      successHandle,
      errorHandle
    );
  }
}

