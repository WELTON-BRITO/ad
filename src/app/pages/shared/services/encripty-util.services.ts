import { Injectable, Inject } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncriptyUtilService {
  private encryptSecretKey = '@mp1u5';

  constructor(
   

  ) { }

  encriptyBySecretKey(data:any){
    let iv = CryptoJS.lib.WordArray.random(16);
    return CryptoJS.AES.encrypt(data, this.encryptSecretKey, {iv: iv});
  }  

  decriptyBySecretKey(data:any){
    if(data!=null && data!=='null'){
      let iv = CryptoJS.lib.WordArray.random(16);
      let bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey, {iv: iv});
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return data;
  }  

}
