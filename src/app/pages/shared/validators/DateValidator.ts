import {AbstractControl} from '@angular/forms';
import * as moment from 'moment';

export class DateValidator {
  static dateValidator(AC: AbstractControl) {
    if (AC && AC.value && !moment(AC.value, 'DD/MM/YYYY',true).isValid()) {
      return {'dateVaidator': true};
    }
    return null;
  }
}
