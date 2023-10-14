import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-motivo-cancelamento',
  templateUrl: 'motivo-cancelamento.component.html',
  styleUrls: ['motivo-cancelamento.component.scss'],
})
export class MotivoCancelamentoComponent {

  constructor(protected ref: NbDialogRef<MotivoCancelamentoComponent>) {}

  cancel() {
    this.ref.close();
  }

  submit(cancellationReason) {
    this.ref.close(cancellationReason);
  }
}
