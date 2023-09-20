import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'ngx-gestao-paciente',
  styleUrls: ['./gestao-paciente.component.scss'],
  template: `
  <router-outlet></router-outlet>
`,
})
export class GestaoPacienteComponent implements OnInit {
   
  constructor() {}

  ngOnInit() {}
}
