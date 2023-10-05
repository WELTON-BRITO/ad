import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService, private seoService: SeoService) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
    localStorage.setItem('Authorization', '');

    
  }

  async setHidden(menus) {

    var name = localStorage.getItem('bway-domain');

    await  menus.forEach(menu => {

        //this.role = menu.data

        if (menu.data) {

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
          }*/
        }
      });
}

}
