import { Component, Input, OnInit } from "@angular/core";
import { LoaderService } from "./loader.service";

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
  })
  export class LoaderComponent implements OnInit {
    @Input() tamanho: string;
    @Input() direction: string;
    isActive: boolean;
  
    modalLoadCirc = {
      tamanho: '',
      direction: 'center'
    };
  
    loadCirc = {
      tamanho: 'big',
      direction: 'center'
    };
  
    constructor(private loaderService: LoaderService) { }
  
    ngOnInit() {
      this.loaderService.loader.subscribe(data => {
        this.isActive = data;
      });
    }
  }