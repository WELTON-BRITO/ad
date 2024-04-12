import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NB_WINDOW, NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HeaderService } from './header.service';
import { AuthenticationService } from '../../../pages/shared/services/authenticationService.services';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  
  headerInformation = {
    enterpriseName: '',
  };
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Tema - Claro',
    },
    {
      value: 'dark',
      name: 'Tema - Dark',
    },
    {
      value: 'cosmic',
      name: 'Tema - Cosmic',
    },
    {
      value: 'corporate',
      name: 'Tema - Negócios',
    },
  ];

  currentTheme = 'default';

  userMenu = [ { title: 'Sair', } ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private headerService: HeaderService,
              private authenticationService: AuthenticationService,
              private nbMenuService: NbMenuService,
              @Inject(NB_WINDOW) private window) {
                this.headerInformation.enterpriseName = localStorage.getItem('bway-user');   
                //this.headerService.assignHeaderInformation(this.headerInformation);          
              }
              
   

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    let userName = localStorage.getItem('bway-enterprise-name');

    this.user = {
      name: userName,     
    }
   
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

      this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'context-user'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => this.userContexMenuSwitch(title));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  doLogout() {
    this.authenticationService.doLogout();
  }

  userContexMenuSwitch(title) {
    if (title === 'Sair') {
      this.doLogout();
    }
  }

}
