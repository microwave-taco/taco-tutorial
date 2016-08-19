import { Component }          from '@angular/core';
import { NgRedux }            from 'ng2-redux';
import { IAppState }          from '../../store/index';
import { ROUTER_DIRECTIVES, Router }  from '@angular/router';
import { Auth }               from '../../services/auth.service';
import { LogoutActions }      from '../../actions/logout.actions';


@Component({
  selector: 'menu-bar',
  directives: [ ROUTER_DIRECTIVES ],
  providers: [ LogoutActions ],
  styles: [`
    .menu {
      background-color: #33495f;
      width: 100%;
      height: 150px;
      font-size: 1.3em;
      color: #ffffff;
    }
    .menuItem {
      background-color: #33495f;
      height: 45px;
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;
      border: none;
      margin: 105px 3px 0px 3px;
      color: #ffffff;
      float: right;
      font-family: 'Roboto';
      position: relative;

    }
    .menuItem a {
      text-decoration: none;
      color: #ffffff;
    }
    .menuItemActive {
      background-color: #ffffff;
      text-decoration: none;
    }
    .menuItemActive a{
      color: #33495f !important;
    }
    .menuItem:hover{
      background-color: white;
      border: none;
      text-decoration: none;
    }
    .menuItem:hover a{
      color: #f58a2e;
    }
    .logo {
      font-family: 'Roboto';
      max-width: 100px;
    }
    .logoImg {
      max-height: 133px;
      max-width: 200px;
      border-radius: 0px;
      position: absolute;
      margin-left: -30px;
      margin-top: 15;
    }
    .logo-text {
      font-family: 'Roboto';
      max-width: 100px;
      margin-left: 120px;
    }

  `],
  template: `
  <nav class="menu">
    <div class='logo'>
      <img class='logoImg' src='../assets/logo/rocket-logo.svg' />
    </div>
    <button
      class="menuItem"
      *ngIf="isAuthenticated()"
      (click)="navigate('#'); logout()"
    >
      <a>Log Out</a>
    </button>
    <button
      class="menuItem"
      [routerLinkActive]="['menuItemActive']"
      *ngIf="isInSession()"
      (click)="navigate('/session')"
    >
      <a>Session</a>
    </button>
    <button
      class="menuItem"
      [routerLinkActive]="['menuItemActive']"
      *ngIf="!isAuthenticated()"
      (click)="navigate('/login')"
    >
      <a>Log In</a>
    </button>
    <button
      class="menuItem"
      [routerLinkActive]="['menuItemActive']"
      (click)="navigate('/advanced-search')"
    >
      <a>Advanced Search</a>
    </button>
    <button
      class="menuItem"
      [routerLinkActive]="['menuItemActive']"
      *ngIf="isTeacher()"
      (click)="navigate('/teacher-dash')"
    >
      <a>Teacher Dashboard</a>
    </button>
    <button
      class="menuItem"
      [routerLinkActive]="['menuItemActive']"
      *ngIf="isAuthenticated()"
      (click)="nagivate('/student-dash')"
    >
      <a>Student Dashboard</a>
    </button>
    <button
      class="menuItem"
      [routerLinkActive]="['menuItemActive']"
      (click)="navigate('/home')"
    >
      <a>Home</a>
    </button>
  </nav>
  `
})
export class MenuBarComponent {
  constructor(
    private auth: Auth,
    private ngRedux: NgRedux<IAppState>,
    private logoutActions: LogoutActions,
    private router: Router
  ) { }

  isAuthenticated() {
    return this.auth.isAuthenticated();
  }

  isTeacher() {
    if (this.ngRedux.getState()['login']['userData'] !== undefined) {
      return this.auth.isTeacher();
    }
    return false;
  }

  logout () {
    localStorage.clear();
    this.auth.logout();
    this.logoutActions.setLogoutDispatch();
  }

  isInSession() {
    return !!this.ngRedux.getState().session.sessionID;
  }

  navigate(path) {
    this.router.navigate([path]);
  }
}