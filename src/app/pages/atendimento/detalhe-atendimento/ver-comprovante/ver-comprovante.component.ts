import { Component, Input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-ver-comprovante',
  templateUrl: 'ver-comprovante.component.html',
  styleUrls: ['ver-comprovante.component.scss'],
})
export class VerComprovanteComponent {

  @Input() imageUrl: SafeUrl;

  constructor(protected ref: NbDialogRef<VerComprovanteComponent>) {}

  dismiss() {
    this.ref.close();
  }
}
