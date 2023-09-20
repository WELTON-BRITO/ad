import { NgModule } from '@angular/core';
import { NbCardModule, NbButtonModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {CommonModule} from '@angular/common';


@NgModule({
  imports: [
    NbCardModule,
    NbButtonModule,
    NgxDatatableModule,
    CommonModule,
  ],
  exports: [
  ],
  declarations: [
  ],
  entryComponents: [
  ],
})
export class ComponentstModule { }
