import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccessGroup } from 'src/app/model/AccessGroup';
import { LoginService } from 'src/app/service/login.service';

@Injectable({
  providedIn: 'root'
})
export class SaleOrderGuard implements CanActivate {

  accessGroup: AccessGroup;
  openPage: boolean;
  
  constructor(private login: LoginService) { }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if(sessionStorage.getItem('user') != null) this.openPage = true;
  
    return this.openPage;
    
  }
  
}
