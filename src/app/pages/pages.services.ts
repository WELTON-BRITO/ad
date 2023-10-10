import { Injectable } from '@angular/core';
import { MENU_ITEMS } from './pages-menu';

@Injectable({
  providedIn: 'root',
})
export class PagesService {

  constructor() { }

  async setHidden(menus) {

    var name = localStorage.getItem('bway-domain');

    await menus.forEach(menu => {

      if (menu.data) {

        if (name == 'DOCTOR' && menu.title == 'Configurar Clínica') {
          menu['hidden'] = true;
        } else {
          menu['hidden'] = false;
        }

      }
    });
  }

}
