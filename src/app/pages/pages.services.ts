import { Injectable } from '@angular/core';
import { MENU_ITEMS } from './pages-menu';

@Injectable({
    providedIn: 'root',
})
export class PagesService {

    constructor() { }

    async setHidden(menus) {

        await menus.forEach(menu => {
            console.log(menu)
            console.log(menu.data)
            if (menu.data == 'USER') {
                console.log('entrei dentro do meu user')
                menu['hidden'] = false;
            }

        });
    }

}
