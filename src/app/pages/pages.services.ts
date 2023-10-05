import { Injectable } from '@angular/core';
import { MENU_ITEMS } from './pages-menu';

@Injectable({
    providedIn: 'root',
})
export class PagesService {

    role = [];
    constructor() { }

    async setHidden(menus) {

        var name = localStorage.getItem('bway-domain');

        await  menus.forEach(menu => {

            this.role = menu.data
            menu['hidden'] = false;
           /* if (menu.data) {

                if(name == 'DOCTOR' && menu.title == 'Configurar Clínica'){
                    menu['hidden'] = true;
                }
      
              /*let hasRole = this.role.indexOf(menu.data.toString()) >= 0;
            if (hasRole) {
              menu['hidden'] = false;
            }else {
              menu['hidden'] = false;
            }
              if (menu['children'] && menu['children'].length > 0) {
                this.setHidden(menu['children']);
              }
            }*/
          });
    }

}
