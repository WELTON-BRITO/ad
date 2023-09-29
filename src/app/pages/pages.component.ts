import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { PagesService } from './pages.services';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  //menu = MENU_ITEMS;
  menu = [];

  constructor( private pageService: PagesService) {
    this.menu = MENU_ITEMS;
    this.pageService.setHidden(this.menu);

  }
}
