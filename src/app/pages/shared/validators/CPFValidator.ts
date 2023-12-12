import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CPFValidator {

  /**
   * Checks if the input string 'cpfStr' is a valid CPF
   * @param cpfStr
   * @returns true or false
   */
  public static isValidCPF(cpfStr: String) {
    if (cpfStr == null || cpfStr.length === 0) return false;

    //Extract only the numbers
    let cpf = (cpfStr.match(/\d+/g) || []).join('');
    if (cpf.length != 11) return false;

    //Checks if all numbers are the same
    if (new Set(cpf).size === 1) return false;

    let sum;
    let rest;
    sum = 0;

    //Checks if CPF is a valid number
    for (let i = 1; i <= 9; i++) sum = sum + Number.parseInt(cpf.substring(i - 1, i)) * (11 - i);
    rest = (sum * 10) % 11;
    if ((rest === 10) || (rest === 11)) rest = 0;
    if (rest !== Number.parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + Number.parseInt(cpf.substring(i - 1, i)) * (12 - i);
    rest = (sum * 10) % 11;
    if ((rest === 10) || (rest === 11)) rest = 0;
    if (rest !== Number.parseInt(cpf[10])) return false;

    return true;
  }

  public static isValidCNPJ(cpfStr: String) {
    if (cpfStr == null || cpfStr.length === 0) return false;

    var cnpj = cpfStr.replace(/[^\d]+/g, '');

    if (cnpj.length != 14) return false;

    if (new Set(cnpj).size === 1) return false;

    if (cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999")
      return false;

    return true;
  }

  /**
   * Extract only the numbers from input string 'cpfStr'
   * @param cpfStr
   * @returns string
   */
  public static getCPFNumbers(cpfStr: String) {
    if (cpfStr == null || cpfStr.length === 0) return "";

    return (cpfStr.match(/\d+/g) || []).join('');
  }

  /**
   * Formats the input string 'cpfStr' to the pattern of CPF [000.000.000-00]
   * @param cpfStr
   * @returns String that contains the formatted CPF
   */
  public static getFormattedCpf(cpfStr: String) {
    let formatted = this.getCPFNumbers(cpfStr);

    if (formatted.length == 11) {
      formatted = formatted.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (formatted.length == 14) {
      formatted = formatted.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    }

    return formatted;
  }


}
